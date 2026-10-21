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
        CAPPluginMethod(name: "tasks", returnType: CAPPluginReturnPromise)
    ]

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

    #if canImport(FoundationModels)
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
