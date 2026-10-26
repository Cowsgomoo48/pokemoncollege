import Foundation
import Capacitor
#if canImport(FoundationModels)
import FoundationModels
#endif

// Study AI: summaries, key terms, quiz questions and task-finding with Apple's on-device model
// (Apple Intelligence, iOS 26+). Runs entirely on the iPhone. If the model isn't available the
// page falls back to its simpler built-in summary.
@objc(StudyAIPlugin)
public class StudyAIPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "StudyAIPlugin"
    public let jsName = "StudyAI"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "summarize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "quiz", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "tasks", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "studyGuide", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "tutor", returnType: CAPPluginReturnPromise)
    ]

    // Tutor: step-by-step help for one question (a hint for each step, plus the step worked out)
    @objc func tutor(_ call: CAPPluginCall) {
        let question = call.getString("question") ?? ""
        let answer = call.getString("answer") ?? ""
        let choices = (call.getArray("choices", String.self) ?? []).joined(separator: " | ")
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            Task {
                let prompt = "Question: \(question)\nCorrect answer: \(answer)" + (choices.isEmpty ? "" : "\nAnswer choices: \(choices)") + "\n\n" + StudyAIPlugin.tutorPrompt
                var steps: [[String: String]] = []
                var lastError = ""
                for strict in [false, true] {
                    do {
                        let session = strict ? LanguageModelSession(instructions: StudyAIPlugin.tutorInstructions) : LanguageModelSession(model: SystemLanguageModel(guardrails: .permissiveContentTransformations), instructions: StudyAIPlugin.tutorInstructions)
                        let r = try await session.respond(to: prompt)
                        steps = StudyAIPlugin.parseSteps(r.content)
                        if !steps.isEmpty { break }
                    } catch {
                        lastError = String(describing: error)
                    }
                }
                if steps.isEmpty {
                    call.reject("AI tutor failed: " + String(lastError.prefix(120)))
                    return
                }
                call.resolve(["steps": steps])
            }
            return
        }
        #endif
        call.reject("unavailable")
    }

    @objc func status(_ call: CAPPluginCall) {
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            switch SystemLanguageModel.default.availability {
            case .available:
                call.resolve(["available": true])
            case .unavailable(let reason):
                call.resolve(["available": false, "reason": String(describing: reason)])
            @unknown default:
                call.resolve(["available": false, "reason": "unknown"])
            }
            return
        }
        #endif
        call.resolve(["available": false, "reason": "needsIOS26"])
    }

    @objc func summarize(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            Task {
                do {
                    let source = try await StudyAIPlugin.condense(text)
                    let session = LanguageModelSession(instructions: "You help a college student study. Write in plain, friendly English. Only use facts that are in the notes.")
                    let r = try await session.respond(to: "Make study notes from these class notes:\n\n" + source, generating: AISummary.self).content
                    call.resolve([
                        "summary": r.summary,
                        "keyTerms": r.keyTerms.map { ["term": $0.term, "definition": $0.definition] },
                        "keyPoints": r.keyPoints
                    ])
                } catch {
                    call.reject("AI summary failed: " + error.localizedDescription)
                }
            }
            return
        }
        #endif
        call.reject("unavailable")
    }

    @objc func quiz(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        let count = max(3, min(10, call.getInt("count") ?? 8))
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            Task {
                do {
                    let source = try await StudyAIPlugin.condense(text)
                    let session = LanguageModelSession(instructions: "You write fair multiple-choice study questions for a college student. Every question must be answerable from the notes. Wrong answers must be plausible but clearly wrong.")
                    let r = try await session.respond(to: "Write \(count) multiple-choice questions about these notes:\n\n" + source, generating: AIQuiz.self).content
                    call.resolve(["questions": r.questions.map { ["question": $0.question, "answer": $0.answer, "wrong": $0.wrong] }])
                } catch {
                    call.reject("AI quiz failed: " + error.localizedDescription)
                }
            }
            return
        }
        #endif
        call.reject("unavailable")
    }

    @objc func tasks(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        let today = call.getString("today") ?? ""
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            Task {
                do {
                    let source = try await StudyAIPlugin.condense(text)
                    let session = LanguageModelSession(instructions: "You find homework, readings, assignments, quizzes, tests and deadlines that a teacher mentions. Today is \(today). Turn words like 'Friday' or 'next week' into real dates. Ignore anything that isn't something the student has to do.")
                    let r = try await session.respond(to: "List the student's tasks from this lecture transcript:\n\n" + source, generating: AITasks.self).content
                    call.resolve(["tasks": r.tasks.map { ["title": $0.title, "due": $0.due] }])
                } catch {
                    call.reject("AI task finder failed: " + error.localizedDescription)
                }
            }
            return
        }
        #endif
        call.reject("unavailable")
    }

    // Study guide: reads the whole set piece by piece and lists the problem types, formulas,
    // concepts and worked examples it covers. Nothing is summarized away first, so big sets keep
    // their coverage; the page merges the lists and removes duplicates.
    @objc func studyGuide(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        #if canImport(FoundationModels)
        if #available(iOS 26.0, *) {
            Task {
                let pieces = StudyAIPlugin.split(text, limit: 5000, maxParts: 24)
                var types: [[String: String]] = []
                var formulas: [[String: String]] = []
                var concepts: [[String: String]] = []
                var examples: [String] = []
                var done = 0
                var lastError = ""
                for (i, piece) in pieces.enumerated() {
                    // 1st try: plain text with Apple's relaxed guardrails for transforming the user's own notes
                    // (structured output keeps the strict guardrails, which were blocking ordinary class notes)
                    var got = false
                    do {
                        let model = SystemLanguageModel(guardrails: .permissiveContentTransformations)
                        let session = LanguageModelSession(model: model, instructions: StudyAIPlugin.guideInstructions)
                        let r = try await session.respond(to: StudyAIPlugin.guidePrompt + piece)
                        let part = StudyAIPlugin.parseGuide(r.content)
                        if !(part.types.isEmpty && part.formulas.isEmpty && part.concepts.isEmpty) {
                            types += part.types; formulas += part.formulas; concepts += part.concepts; examples += part.examples
                            got = true
                        }
                    } catch {
                        lastError = String(describing: error)
                    }
                    // 2nd try: the structured version
                    if !got {
                        do {
                            let session = LanguageModelSession(instructions: StudyAIPlugin.guideInstructions)
                            let r = try await session.respond(to: StudyAIPlugin.guidePrompt + piece, generating: AIGuidePart.self).content
                            types += r.problemTypes.map { ["name": $0.name, "how": $0.howTo] }
                            formulas += r.formulas.map { ["name": $0.name, "formula": $0.formula, "use": $0.use] }
                            concepts += r.concepts.map { ["name": $0.name, "meaning": $0.meaning] }
                            examples += r.examples
                            got = true
                        } catch {
                            lastError = String(describing: error)
                        }
                    }
                    if got { done += 1 }
                    self.notifyListeners("guideProgress", data: ["done": i + 1, "total": pieces.count])
                }
                if done == 0 {
                    call.reject(lastError.lowercased().contains("guardrail") ? "Apple’s AI safety filter blocked these notes" : "AI study guide failed: " + String(lastError.prefix(120)))
                    return
                }
                var overview = ""
                do {
                    let topics = (types.map { $0["name"] ?? "" } + formulas.map { $0["name"] ?? "" } + concepts.map { $0["name"] ?? "" }).joined(separator: "; ")
                    let session = LanguageModelSession(model: SystemLanguageModel(guardrails: .permissiveContentTransformations), instructions: "You help a college student study. Write in plain, friendly English.")
                    overview = try await session.respond(to: "In 3 to 5 sentences, describe what this study set covers and what the student must be able to do. Topics: " + String(topics.prefix(3500))).content
                } catch {
                    overview = ""
                }
                call.resolve(["overview": overview, "problemTypes": types, "formulas": formulas, "concepts": concepts, "examples": examples, "parts": pieces.count])
            }
            return
        }
        #endif
        call.reject("unavailable")
    }

    #if canImport(FoundationModels)
    static let tutorInstructions = "You are a patient tutor for a college student. You explain how to solve problems one step at a time, the way a good teacher would at a whiteboard. Write math as plain text with Unicode symbols (½, ², √, θ, Δ, ·, ×); never use LaTeX or backslashes."
    static let tutorPrompt = "Explain how to get from the question to the correct answer in 3 to 5 steps. Write one step per line using exactly this format and nothing else:\nSTEP: what to do next and why, without giving away the final answer | the same step worked out with the actual numbers\n\nThe first step says which idea or formula to use and why it fits. The last step finishes the work and ends with the correct answer. If the question is not a calculation, explain the reasoning that leads to the answer instead."
    // reads lines like "STEP: hint | worked step" back into a list
    static func parseSteps(_ text: String) -> [[String: String]] {
        var out: [[String: String]] = []
        for raw in text.components(separatedBy: .newlines) {
            var line = raw.trimmingCharacters(in: .whitespaces)
            while line.hasPrefix("-") || line.hasPrefix("*") || line.hasPrefix("•") { line = String(line.dropFirst()).trimmingCharacters(in: .whitespaces) }
            guard line.uppercased().hasPrefix("STEP"), let colon = line.firstIndex(of: ":") else { continue }
            let rest = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
            let parts = rest.components(separatedBy: "|").map { $0.trimmingCharacters(in: .whitespaces) }
            guard let first = parts.first, !first.isEmpty else { continue }
            out.append(["hint": first, "work": parts.count > 1 ? parts[1...].joined(separator: " | ") : ""])
        }
        return Array(out.prefix(6))
    }
    static let guideInstructions = "You help a college student plan their studying. The notes may come from photos of handwriting, so some words are garbled: ignore text that makes no sense, and where the notes clearly cover a standard textbook topic, fill in the standard facts so each item is complete and correct. Describe kinds of problems, formulas and ideas, not the specific homework questions. Write math as plain text with Unicode symbols (½, ², √, θ, Δ, ·); never use LaTeX or backslashes. Replace the words after each label with real content."
    static let guidePrompt = "Write one item per line using exactly these formats and nothing else:\nTYPE: kind of problem | how to solve it in one sentence\nFORMULA: name | the formula | when to use it\nCONCEPT: idea | what it means in one sentence\nEXAMPLE: a short worked example\n\nStudy material:\n"
    // reads lines like "TYPE: name | how" back into lists
    static func parseGuide(_ text: String) -> (types: [[String: String]], formulas: [[String: String]], concepts: [[String: String]], examples: [String]) {
        var t: [[String: String]] = [], f: [[String: String]] = [], c: [[String: String]] = [], e: [String] = []
        for raw in text.components(separatedBy: .newlines) {
            var line = raw.trimmingCharacters(in: .whitespaces)
            while line.hasPrefix("-") || line.hasPrefix("*") || line.hasPrefix("•") { line = String(line.dropFirst()).trimmingCharacters(in: .whitespaces) }
            guard let colon = line.firstIndex(of: ":") else { continue }
            let key = line[..<colon].uppercased().trimmingCharacters(in: .whitespaces)
            let rest = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
            let parts = rest.components(separatedBy: "|").map { $0.trimmingCharacters(in: .whitespaces) }
            guard let first = parts.first, !first.isEmpty else { continue }
            switch key {
            case "TYPE": t.append(["name": first, "how": parts.count > 1 ? parts[1] : ""])
            case "FORMULA": f.append(["name": first, "formula": parts.count > 1 ? parts[1] : "", "use": parts.count > 2 ? parts[2] : ""])
            case "CONCEPT": c.append(["name": first, "meaning": parts.count > 1 ? parts[1] : ""])
            case "EXAMPLE": e.append(rest)
            default: continue
            }
        }
        return (t, f, c, e)
    }

    // cut text into pieces of at most `limit` characters, ending at a sentence or line break where possible
    static func split(_ text: String, limit: Int, maxParts: Int) -> [String] {
        let clean = text.trimmingCharacters(in: .whitespacesAndNewlines)
        var parts: [String] = []
        var rest = Substring(clean)
        while !rest.isEmpty && parts.count < maxParts {
            var piece = rest.prefix(limit)
            if piece.count == limit, let cut = piece.lastIndex(where: { ".!?\n".contains($0) }) { piece = rest[rest.startIndex...cut] }
            parts.append(String(piece))
            rest = rest.dropFirst(piece.count)
        }
        return parts
    }

    // The on-device model has a small context window (about 4,096 tokens), so long text is
    // summarized piece by piece first and the pieces are combined.
    @available(iOS 26.0, *)
    static func condense(_ text: String) async throws -> String {
        let limit = 6000
        let clean = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if clean.count <= limit { return clean }
        var parts: [String] = []
        var rest = Substring(clean)
        while !rest.isEmpty && parts.count < 12 {
            var piece = rest.prefix(limit)
            if piece.count == limit, let cut = piece.lastIndex(where: { ".!?\n".contains($0) }) { piece = rest[rest.startIndex...cut] }
            let session = LanguageModelSession(instructions: "Summarize class notes faithfully. Keep every definition, date, name and number.")
            let r = try await session.respond(to: "Summarize this part of the notes in at most 10 short sentences:\n\n" + String(piece))
            parts.append(r.content)
            rest = rest.dropFirst(piece.count)
        }
        return String(parts.joined(separator: "\n").prefix(limit))
    }
    #endif
}

#if canImport(FoundationModels)
@available(iOS 26.0, *)
@Generable
struct AITerm {
    @Guide(description: "A key term or concept from the notes, 1 to 5 words")
    var term: String
    @Guide(description: "A short, clear definition in one sentence")
    var definition: String
}

@available(iOS 26.0, *)
@Generable
struct AISummary {
    @Guide(description: "A 3 to 6 sentence summary in plain language")
    var summary: String
    @Guide(description: "The key terms with definitions", .count(0...12))
    var keyTerms: [AITerm]
    @Guide(description: "The most important points, one sentence each", .count(1...8))
    var keyPoints: [String]
}

@available(iOS 26.0, *)
@Generable
struct AIQuestion {
    @Guide(description: "The question")
    var question: String
    @Guide(description: "The correct answer, short")
    var answer: String
    @Guide(description: "Three plausible but wrong answers, short", .count(3))
    var wrong: [String]
}

@available(iOS 26.0, *)
@Generable
struct AIQuiz {
    @Guide(description: "The questions", .count(1...10))
    var questions: [AIQuestion]
}

@available(iOS 26.0, *)
@Generable
struct AIProblemType {
    @Guide(description: "A kind of problem the student must be able to solve, like 'Two-step linear equations' or 'Converting grams to moles'")
    var name: String
    @Guide(description: "One sentence on how to solve this kind of problem")
    var howTo: String
}

@available(iOS 26.0, *)
@Generable
struct AIFormula {
    @Guide(description: "The formula's name, like 'Ideal gas law'")
    var name: String
    @Guide(description: "The formula in plain text, like 'PV = nRT'")
    var formula: String
    @Guide(description: "When to use it, in one short sentence")
    var use: String
}

@available(iOS 26.0, *)
@Generable
struct AIConcept {
    @Guide(description: "A concept or idea the student must understand, 1 to 5 words")
    var name: String
    @Guide(description: "What it means, in one clear sentence")
    var meaning: String
}

@available(iOS 26.0, *)
@Generable
struct AIGuidePart {
    @Guide(description: "The kinds of problems in this material", .count(0...8))
    var problemTypes: [AIProblemType]
    @Guide(description: "Formulas and equations used in this material", .count(0...8))
    var formulas: [AIFormula]
    @Guide(description: "Important concepts in this material", .count(0...8))
    var concepts: [AIConcept]
    @Guide(description: "Up to 3 short worked examples from the material, each written as 'problem → answer'", .count(0...3))
    var examples: [String]
}

@available(iOS 26.0, *)
@Generable
struct AITaskItem {
    @Guide(description: "A short task title, like 'Read chapter 9' or 'Lab report on titration'")
    var title: String
    @Guide(description: "The due date as YYYY-MM-DD, or an empty string if no date was mentioned")
    var due: String
}

@available(iOS 26.0, *)
@Generable
struct AITasks {
    @Guide(description: "The tasks the student was given", .count(0...10))
    var tasks: [AITaskItem]
}
#endif
