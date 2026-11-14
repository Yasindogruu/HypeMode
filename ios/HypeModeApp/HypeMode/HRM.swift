import Foundation
import CoreBluetooth

/// Bluetooth nabız yayını (standart Heart Rate servisi 0x180D): Fitbit "nabzı paylaş", göğüs bandı vb.
final class HRM: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var cm: CBCentralManager?
    private var p: CBPeripheral?
    private var wanted = false
    var onBpm: ((Int, String) -> Void)?
    var onState: ((String) -> Void)?
    var onBattery: ((Int, String) -> Void)?
    private let svc = CBUUID(string: "180D"), chr = CBUUID(string: "2A37"), bsvc = CBUUID(string: "180F"), bchr = CBUUID(string: "2A19")

    func start() {
        wanted = true
        if cm == nil { cm = CBCentralManager(delegate: self, queue: .main) }
        else if cm?.state == .poweredOn { scan() }
    }

    func stop() {
        wanted = false
        cm?.stopScan()
        if let p = p { cm?.cancelPeripheralConnection(p) }
        p = nil
        onState?("off")
    }

    private func scan() {
        guard wanted, let cm = cm else { return }
        if let c = cm.retrieveConnectedPeripherals(withServices: [svc]).first {
            connect(c); return
        }
        cm.scanForPeripherals(withServices: [svc], options: nil)
        onState?("scan")
    }

    private func connect(_ x: CBPeripheral) {
        p = x; x.delegate = self
        cm?.stopScan(); cm?.connect(x, options: nil)
    }

    func centralManagerDidUpdateState(_ c: CBCentralManager) {
        if c.state == .poweredOn { scan() } else if wanted { onState?("bt-off") }
    }
    func centralManager(_ c: CBCentralManager, didDiscover x: CBPeripheral, advertisementData: [String: Any], rssi RSSI: NSNumber) { connect(x) }
    func centralManager(_ c: CBCentralManager, didConnect x: CBPeripheral) { x.discoverServices([svc, bsvc]) }
    func centralManager(_ c: CBCentralManager, didFailToConnect x: CBPeripheral, error: Error?) { onState?("lost") }
    func centralManager(_ c: CBCentralManager, didDisconnectPeripheral x: CBPeripheral, error: Error?) {
        if wanted { onState?("lost"); c.connect(x, options: nil) }
    }
    func peripheral(_ x: CBPeripheral, didDiscoverServices error: Error?) {
        x.services?.forEach { sv in
            if sv.uuid == svc { x.discoverCharacteristics([chr], for: sv) }
            if sv.uuid == bsvc { x.discoverCharacteristics([bchr], for: sv) }
        }
    }
    func peripheral(_ x: CBPeripheral, didDiscoverCharacteristicsFor s: CBService, error: Error?) {
        if s.uuid == bsvc {
            s.characteristics?.filter { $0.uuid == bchr }.forEach { x.readValue(for: $0); if $0.properties.contains(.notify) { x.setNotifyValue(true, for: $0) } }
            return
        }
        s.characteristics?.filter { $0.uuid == chr }.forEach { x.setNotifyValue(true, for: $0) }
        onState?("on")
    }
    func peripheral(_ x: CBPeripheral, didUpdateValueFor c: CBCharacteristic, error: Error?) {
        if c.uuid == bchr, let d = c.value, let v = d.first { onBattery?(Int(v), x.name ?? "Bileklik"); return }
        guard let d = c.value, d.count >= 2 else { return }
        let f = d[d.startIndex]
        let b1 = Int(d[d.startIndex + 1])
        let bpm = (f & 1) == 1 && d.count >= 3 ? b1 | (Int(d[d.startIndex + 2]) << 8) : b1
        onBpm?(bpm, x.name ?? "Nabız")
    }
}
