import Foundation
import HealthKit

final class Health {
    let store = HKHealthStore()
    private let iso: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime]; return f
    }()

    private func qt(_ ids: [HKQuantityTypeIdentifier]) -> [HKQuantityType] { ids.compactMap { HKObjectType.quantityType(forIdentifier: $0) } }

    /// Okunan her şey
    private var readTypes: Set<HKObjectType> {
        var ids: [HKQuantityTypeIdentifier] = [.heartRate, .restingHeartRate, .walkingHeartRateAverage, .heartRateVariabilitySDNN,
            .stepCount, .distanceWalkingRunning, .distanceCycling, .distanceSwimming, .flightsClimbed, .appleExerciseTime, .appleStandTime,
            .activeEnergyBurned, .basalEnergyBurned, .oxygenSaturation, .respiratoryRate, .vo2Max, .bodyTemperature,
            .bodyMass, .height, .bodyMassIndex, .bodyFatPercentage, .leanBodyMass, .waistCircumference,
            .bloodPressureSystolic, .bloodPressureDiastolic, .bloodGlucose,
            .dietaryEnergyConsumed, .dietaryProtein, .dietaryCarbohydrates, .dietaryFatTotal, .dietaryFiber, .dietarySugar,
            .dietaryWater, .dietaryCaffeine]
        if #available(iOS 16.0, *) { ids.append(.appleSleepingWristTemperature) }
        var s = Set<HKObjectType>(qt(ids))
        s.insert(HKObjectType.workoutType())
        if let sl = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) { s.insert(sl) }
        if let mi = HKObjectType.categoryType(forIdentifier: .mindfulSession) { s.insert(mi) }
        return s
    }

    /// Yazılan her şey: kilo/boy/yağ, öğün kalori+makro, su, kafein, antrenmanlar
    private var shareTypes: Set<HKSampleType> {
        var s = Set<HKSampleType>(qt([.bodyMass, .height, .bodyFatPercentage, .dietaryEnergyConsumed, .dietaryProtein,
                                       .dietaryCarbohydrates, .dietaryFatTotal, .dietaryWater, .dietaryCaffeine, .activeEnergyBurned]))
        s.insert(HKObjectType.workoutType())
        return s
    }

    func authorize(done: @escaping () -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else { done(); return }
        store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, _ in DispatchQueue.main.async { done() } }
    }

    /// Kiloyu Apple Sağlık'a yazar (Google Health de oradan alır)
    func saveWeight(kg: Double, done: @escaping (Bool) -> Void) {
        guard HKHealthStore.isHealthDataAvailable(), let t = HKObjectType.quantityType(forIdentifier: .bodyMass), kg > 20, kg < 400 else { done(false); return }
        store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, _ in
            let q = HKQuantity(unit: .gramUnit(with: .kilo), doubleValue: kg)
            let smp = HKQuantitySample(type: t, quantity: q, start: Date(), end: Date())
            self.store.save(smp) { ok, _ in DispatchQueue.main.async { done(ok) } }
        }
    }

    // MARK: - HypeMode kayıtlarını yaz (öğün, içecek, antrenman). syncId ile tekrar yazılınca güncellenir.
    private func meta(_ id: String) -> [String: Any] {
        [HKMetadataKeySyncIdentifier: "hm-" + id, HKMetadataKeySyncVersion: NSNumber(value: Int(Date().timeIntervalSince1970))]
    }
    private func qs(_ id: HKQuantityTypeIdentifier, _ unit: HKUnit, _ v: Double, _ start: Date, _ end: Date, _ sid: String) -> HKQuantitySample? {
        guard v > 0, let t = HKObjectType.quantityType(forIdentifier: id) else { return nil }
        return HKQuantitySample(type: t, quantity: HKQuantity(unit: unit, doubleValue: v), start: start, end: end, metadata: meta(sid))
    }
    private func date(_ s: Any?) -> Date? {
        guard let s = s as? String else { return nil }
        let f = ISO8601DateFormatter(); f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f.date(from: s) ?? iso.date(from: s)
    }
    private func activity(_ k: String) -> HKWorkoutActivityType {
        switch k {
        case "run": return .running
        case "walk": return .walking
        case "bike": return .cycling
        case "swim": return .swimming
        case "row": return .rowing
        case "ell": return .elliptical
        case "rope": return .jumpRope
        case "hiit": return .highIntensityIntervalTraining
        case "stairs": return .stairClimbing
        case "strength": return .traditionalStrengthTraining
        default: return .other
        }
    }

    func push(items: [[String: Any]], del: [String], done: @escaping (Int) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else { done(0); return }
        store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, _ in
            let g = DispatchGroup(); var n = 0; let lock = NSLock()
            // silinenler
            if !del.isEmpty {
                let keys = del.flatMap { d in ["k", "p", "c", "f", "w", "cf", "x", ""].map { "hm-" + d + ($0.isEmpty ? "" : "-" + $0) } }
                let pred = HKQuery.predicateForObjects(withMetadataKey: HKMetadataKeySyncIdentifier, allowedValues: keys)
                var types: [HKObjectType] = Array(self.shareTypes); types.append(HKObjectType.workoutType())
                for t in Set(types) { g.enter(); self.store.deleteObjects(of: t, predicate: pred) { _, _, _ in g.leave() } }
            }
            var samples: [HKSample] = []
            for it in items {
                guard let sid = it["sid"] as? String, let kind = it["kind"] as? String, let st = self.date(it["t"]) else { continue }
                let en = self.date(it["e"]) ?? st
                func num(_ k: String) -> Double { (it[k] as? Double) ?? Double(it[k] as? Int ?? 0) }
                switch kind {
                case "meal":
                    samples += [self.qs(.dietaryEnergyConsumed, .kilocalorie(), num("kcal"), st, st, sid + "-k"),
                                self.qs(.dietaryProtein, .gram(), num("p"), st, st, sid + "-p"),
                                self.qs(.dietaryCarbohydrates, .gram(), num("c"), st, st, sid + "-c"),
                                self.qs(.dietaryFatTotal, .gram(), num("f"), st, st, sid + "-f")].compactMap { $0 }
                case "drink":
                    samples += [self.qs(.dietaryWater, .literUnit(with: .milli), num("ml"), st, st, sid + "-w"),
                                self.qs(.dietaryCaffeine, .gramUnit(with: .milli), num("caf"), st, st, sid + "-cf"),
                                self.qs(.dietaryEnergyConsumed, .kilocalorie(), num("kcal"), st, st, sid + "-k")].compactMap { $0 }
                case "workout":
                    guard en > st else { continue }
                    g.enter()
                    let cfg = HKWorkoutConfiguration(); cfg.activityType = self.activity(it["type"] as? String ?? "")
                    let b = HKWorkoutBuilder(healthStore: self.store, configuration: cfg, device: nil)
                    b.beginCollection(withStart: st) { _, _ in
                        var m = self.meta(sid + "-x"); if let nm = it["name"] as? String { m[HKMetadataKeyWorkoutBrandName] = nm }
                        b.addMetadata(m) { _, _ in
                            let kc = num("kcal")
                            let add: (@escaping () -> Void) -> Void = { next in
                                if kc > 0, let s = self.qs(.activeEnergyBurned, .kilocalorie(), kc, st, en, sid + "-k") { b.add([s]) { _, _ in next() } } else { next() }
                            }
                            add {
                                b.endCollection(withEnd: en) { _, _ in
                                    b.finishWorkout { w, _ in if w != nil { lock.lock(); n += 1; lock.unlock() }; g.leave() }
                                }
                            }
                        }
                    }
                default: break
                }
            }
            if !samples.isEmpty {
                g.enter(); self.store.save(samples) { ok, _ in if ok { lock.lock(); n += samples.count; lock.unlock() }; g.leave() }
            }
            g.notify(queue: .main) { done(n) }
        }
    }

    func sync(days: Int, done: @escaping ([String: Any]) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else { done(["error": "unavailable"]); return }
        store.requestAuthorization(toShare: shareTypes, read: readTypes) { _, _ in
            let g = DispatchGroup(), lock = NSLock()
            var out: [String: Any] = [:]
            func put(_ k: String, _ v: Any) { lock.lock(); out[k] = v; lock.unlock() }
            let cal = Calendar.current, now = Date()
            let start = cal.startOfDay(for: cal.date(byAdding: .day, value: -days, to: now)!)
            let hrStart = cal.startOfDay(for: cal.date(byAdding: .day, value: -1, to: now)!)
            let kStart = cal.startOfDay(for: cal.date(byAdding: .day, value: -13, to: now)!)
            let bpm = HKUnit.count().unitDivided(by: .minute())

            func rows(_ a: [(Date, Double)]) -> [[String: Any]] { a.map { ["t": self.iso.string(from: $0.0), "v": $0.1] } }

            g.enter(); self.samples(.heartRate, bpm, hrStart) { put("hr", rows($0)); g.leave() }
            g.enter(); self.stats(.stepCount, .count(), start, hourly: true, sum: true) { put("steps", rows($0)); g.leave() }
            g.enter(); self.stats(.activeEnergyBurned, .kilocalorie(), kStart, hourly: true, sum: true) { put("kcal", rows($0)); g.leave() }
            g.enter(); self.stats(.basalEnergyBurned, .kilocalorie(), kStart, hourly: true, sum: true) { put("basal", rows($0)); g.leave() }
            g.enter(); self.stats(.distanceWalkingRunning, .meterUnit(with: .kilo), start, hourly: false, sum: true) { put("dist", rows($0)); g.leave() }
            g.enter(); self.stats(.restingHeartRate, bpm, start, hourly: false, sum: false) { put("rhr", rows($0)); g.leave() }
            g.enter(); self.stats(.heartRateVariabilitySDNN, .secondUnit(with: .milli), start, hourly: false, sum: false) { put("hrv", rows($0)); g.leave() }
            g.enter(); self.stats(.oxygenSaturation, .percent(), start, hourly: false, sum: false) { put("spo2", rows($0)); g.leave() }
            g.enter(); self.stats(.respiratoryRate, bpm, start, hourly: false, sum: false) { put("resp", rows($0)); g.leave() }
            g.enter(); self.stats(.vo2Max, HKUnit(from: "ml/kg*min"), start, hourly: false, sum: false) { put("vo2", rows($0)); g.leave() }
            g.enter(); self.workouts(from: start) { put("workouts", $0); g.leave() }
            g.enter(); self.latest(.height, .meter()) { if let v = $0 { put("height", v) }; g.leave() }
            g.enter(); self.latest(.bodyFatPercentage, .percent()) { if let v = $0 { put("fat", v) }; g.leave() }
            g.enter(); self.latestWeight { if let w = $0 { put("weight", w) }; g.leave() }
            g.enter(); self.sleep(from: cal.date(byAdding: .hour, value: -12, to: start)!) { put("sleep", $0); g.leave() }
            g.notify(queue: .main) { done(out) }
        }
    }

    private func samples(_ id: HKQuantityTypeIdentifier, _ unit: HKUnit, _ from: Date, done: @escaping ([(Date, Double)]) -> Void) {
        guard let t = HKObjectType.quantityType(forIdentifier: id) else { done([]); return }
        let q = HKSampleQuery(sampleType: t, predicate: HKQuery.predicateForSamples(withStart: from, end: Date()), limit: 20000,
                              sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { _, s, _ in
            done((s as? [HKQuantitySample] ?? []).map { ($0.startDate, $0.quantity.doubleValue(for: unit)) })
        }
        store.execute(q)
    }

    private func stats(_ id: HKQuantityTypeIdentifier, _ unit: HKUnit, _ from: Date, hourly: Bool, sum: Bool, done: @escaping ([(Date, Double)]) -> Void) {
        guard let t = HKObjectType.quantityType(forIdentifier: id) else { done([]); return }
        var comps = DateComponents(); if hourly { comps.hour = 1 } else { comps.day = 1 }
        let q = HKStatisticsCollectionQuery(quantityType: t,
                                            quantitySamplePredicate: HKQuery.predicateForSamples(withStart: from, end: Date()),
                                            options: sum ? .cumulativeSum : .discreteAverage,
                                            anchorDate: Calendar.current.startOfDay(for: from), intervalComponents: comps)
        q.initialResultsHandler = { _, res, _ in
            var a: [(Date, Double)] = []
            res?.enumerateStatistics(from: from, to: Date()) { s, _ in
                if let v = (sum ? s.sumQuantity() : s.averageQuantity()) { a.append((s.startDate, v.doubleValue(for: unit))) }
            }
            done(a)
        }
        store.execute(q)
    }

    private func latestWeight(done: @escaping ([String: Any]?) -> Void) {
        guard let t = HKObjectType.quantityType(forIdentifier: .bodyMass) else { done(nil); return }
        let q = HKSampleQuery(sampleType: t, predicate: nil, limit: 1,
                              sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)]) { _, s, _ in
            guard let x = (s as? [HKQuantitySample])?.first else { done(nil); return }
            done(["t": self.iso.string(from: x.endDate), "v": x.quantity.doubleValue(for: .gramUnit(with: .kilo)), "src": x.sourceRevision.source.bundleIdentifier])
        }
        store.execute(q)
    }

    private func latest(_ id: HKQuantityTypeIdentifier, _ unit: HKUnit, done: @escaping ([String: Any]?) -> Void) {
        guard let t = HKObjectType.quantityType(forIdentifier: id) else { done(nil); return }
        let q = HKSampleQuery(sampleType: t, predicate: nil, limit: 1,
                              sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)]) { _, s, _ in
            guard let x = (s as? [HKQuantitySample])?.first else { done(nil); return }
            done(["t": self.iso.string(from: x.endDate), "v": x.quantity.doubleValue(for: unit), "src": x.sourceRevision.source.bundleIdentifier])
        }
        store.execute(q)
    }

    private func wname(_ a: HKWorkoutActivityType) -> String {
        switch a {
        case .running: return "RUNNING"
        case .walking, .hiking: return "WALKING"
        case .cycling: return "CYCLING"
        case .swimming: return "SWIMMING"
        case .rowing: return "ROWING"
        case .elliptical: return "ELLIPTICAL"
        case .jumpRope: return "JUMP_ROPE"
        case .highIntensityIntervalTraining, .crossTraining, .mixedCardio: return "HIIT"
        case .stairClimbing, .stairs: return "STAIR_CLIMBING"
        case .traditionalStrengthTraining, .functionalStrengthTraining: return "STRENGTH"
        default: return "OTHER"
        }
    }

    private func workouts(from: Date, done: @escaping ([[String: Any]]) -> Void) {
        let q = HKSampleQuery(sampleType: HKObjectType.workoutType(), predicate: HKQuery.predicateForSamples(withStart: from, end: Date()), limit: 500,
                              sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { _, s, _ in
            done((s as? [HKWorkout] ?? []).map { w in
                ["id": w.uuid.uuidString, "t": self.iso.string(from: w.startDate), "e": self.iso.string(from: w.endDate),
                 "type": self.wname(w.workoutActivityType), "src": w.sourceRevision.source.bundleIdentifier]
            })
        }
        store.execute(q)
    }

    private func sleep(from: Date, done: @escaping ([[String: Any]]) -> Void) {
        guard let t = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else { done([]); return }
        let q = HKSampleQuery(sampleType: t, predicate: HKQuery.predicateForSamples(withStart: from, end: Date()), limit: 20000,
                              sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]) { _, s, _ in
            done((s as? [HKCategorySample] ?? []).map { ["s": self.iso.string(from: $0.startDate), "e": self.iso.string(from: $0.endDate), "v": $0.value] })
        }
        store.execute(q)
    }
}
