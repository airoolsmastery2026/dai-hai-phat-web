extends Node3D

const MIN_WIDTH := 2.4
const MAX_WIDTH := 6.0
const MIN_HEIGHT := 1.6
const MAX_HEIGHT := 3.0

var gate_width := 4.0
var gate_height := 2.2
var slat_count := 12
var frame_color := Color("30343a")
var slat_color := Color("a66f3f")

var gate_root: Node3D
var width_label: Label
var height_label: Label
var slat_label: Label
var send_status_label: Label


func _ready() -> void:
    _build_environment()
    _build_ui()
    _rebuild_gate()


func _build_environment() -> void:
    var world := WorldEnvironment.new()
    var environment := Environment.new()
    environment.background_mode = Environment.BG_COLOR
    environment.background_color = Color("15191e")
    environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
    environment.ambient_light_color = Color("d7dde4")
    environment.ambient_light_energy = 0.65
    world.environment = environment
    add_child(world)

    var light := DirectionalLight3D.new()
    light.rotation_degrees = Vector3(-45.0, -30.0, 0.0)
    light.light_energy = 1.2
    add_child(light)

    var camera := Camera3D.new()
    camera.position = Vector3(0.0, 1.8, 7.2)
    camera.look_at_from_position(camera.position, Vector3(0.0, 1.0, 0.0), Vector3.UP)
    add_child(camera)

    var floor := MeshInstance3D.new()
    var floor_mesh := BoxMesh.new()
    floor_mesh.size = Vector3(12.0, 0.1, 8.0)
    floor.mesh = floor_mesh
    floor.position = Vector3(0.0, -0.08, 0.0)
    var floor_material := StandardMaterial3D.new()
    floor_material.albedo_color = Color("777b80")
    floor.material_override = floor_material
    add_child(floor)


func _build_ui() -> void:
    var canvas := CanvasLayer.new()
    add_child(canvas)

    var panel := PanelContainer.new()
    panel.position = Vector2(24, 24)
    panel.size = Vector2(360, 390)
    canvas.add_child(panel)

    var margin := MarginContainer.new()
    margin.add_theme_constant_override("margin_left", 18)
    margin.add_theme_constant_override("margin_right", 18)
    margin.add_theme_constant_override("margin_top", 18)
    margin.add_theme_constant_override("margin_bottom", 18)
    panel.add_child(margin)

    var stack := VBoxContainer.new()
    stack.add_theme_constant_override("separation", 10)
    margin.add_child(stack)

    var title := Label.new()
    title.text = "DHP Gate Configurator"
    title.add_theme_font_size_override("font_size", 22)
    stack.add_child(title)

    var note := Label.new()
    note.text = "Prototype trực quan — không phải báo giá/kích thước kỹ thuật chính thức"
    note.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    stack.add_child(note)

    width_label = Label.new()
    stack.add_child(width_label)
    var width_slider := HSlider.new()
    width_slider.min_value = MIN_WIDTH
    width_slider.max_value = MAX_WIDTH
    width_slider.step = 0.1
    width_slider.value = gate_width
    width_slider.value_changed.connect(_on_width_changed)
    stack.add_child(width_slider)

    height_label = Label.new()
    stack.add_child(height_label)
    var height_slider := HSlider.new()
    height_slider.min_value = MIN_HEIGHT
    height_slider.max_value = MAX_HEIGHT
    height_slider.step = 0.1
    height_slider.value = gate_height
    height_slider.value_changed.connect(_on_height_changed)
    stack.add_child(height_slider)

    slat_label = Label.new()
    stack.add_child(slat_label)
    var slat_slider := HSlider.new()
    slat_slider.min_value = 6
    slat_slider.max_value = 24
    slat_slider.step = 1
    slat_slider.value = slat_count
    slat_slider.value_changed.connect(_on_slat_count_changed)
    stack.add_child(slat_slider)

    var send := Button.new()
    send.text = "Gửi cấu hình sang AI"
    send.pressed.connect(_send_configuration)
    stack.add_child(send)

    var reset := Button.new()
    reset.text = "Khôi phục cấu hình mẫu"
    reset.pressed.connect(_reset_configuration)
    stack.add_child(reset)

    send_status_label = Label.new()
    send_status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
    stack.add_child(send_status_label)

    _refresh_labels()


func _rebuild_gate() -> void:
    if gate_root:
        gate_root.queue_free()

    gate_root = Node3D.new()
    gate_root.name = "GeneratedGate"
    add_child(gate_root)

    var frame_thickness := 0.09
    var depth := 0.12
    _add_box(Vector3(gate_width, frame_thickness, depth), Vector3(0.0, gate_height, 0.0), frame_color)
    _add_box(Vector3(gate_width, frame_thickness, depth), Vector3(0.0, 0.0, 0.0), frame_color)
    _add_box(Vector3(frame_thickness, gate_height, depth), Vector3(-gate_width / 2.0, gate_height / 2.0, 0.0), frame_color)
    _add_box(Vector3(frame_thickness, gate_height, depth), Vector3(gate_width / 2.0, gate_height / 2.0, 0.0), frame_color)

    var usable_width := gate_width - frame_thickness * 2.6
    var slat_width := min(0.18, usable_width / float(slat_count) * 0.72)
    var step := usable_width / float(slat_count)
    var start_x := -usable_width / 2.0 + step / 2.0

    for index in range(slat_count):
        var x := start_x + step * index
        _add_box(
            Vector3(slat_width, gate_height - frame_thickness * 2.4, depth * 0.72),
            Vector3(x, gate_height / 2.0, 0.01),
            slat_color
        )

    var center_bar_height := 0.08
    _add_box(
        Vector3(gate_width - frame_thickness * 2.0, center_bar_height, depth * 1.05),
        Vector3(0.0, gate_height * 0.52, -0.01),
        frame_color
    )


func _add_box(size: Vector3, position_value: Vector3, color: Color) -> void:
    var instance := MeshInstance3D.new()
    var mesh := BoxMesh.new()
    mesh.size = size
    instance.mesh = mesh
    instance.position = position_value
    var material := StandardMaterial3D.new()
    material.albedo_color = color
    material.metallic = 0.18
    material.roughness = 0.42
    instance.material_override = material
    gate_root.add_child(instance)


func _refresh_labels() -> void:
    width_label.text = "Rộng mẫu: %.1f m" % gate_width
    height_label.text = "Cao mẫu: %.1f m" % gate_height
    slat_label.text = "Số nan mô phỏng: %d" % slat_count


func _send_configuration() -> void:
    if not OS.has_feature("web"):
        send_status_label.text = "Chức năng gửi sang AI hoạt động trong bản Web export."
        return

    var payload := {
        "width": snapped(gate_width, 0.1),
        "height": snapped(gate_height, 0.1),
        "slatCount": slat_count,
        "material": "steel-box-section",
        "color": "powder-coated"
    }
    var payload_json := JSON.stringify(payload)
    var browser_script := "window.parent.postMessage({type:'dhp:gate-selection',payload:%s}, '*');" % payload_json
    JavaScriptBridge.eval(browser_script)
    send_status_label.text = "Đã gửi cấu hình. Tiếp tục với AI Đại Hải Phát ở bên dưới."


func _on_width_changed(value: float) -> void:
    gate_width = value
    _refresh_labels()
    _rebuild_gate()


func _on_height_changed(value: float) -> void:
    gate_height = value
    _refresh_labels()
    _rebuild_gate()


func _on_slat_count_changed(value: float) -> void:
    slat_count = int(value)
    _refresh_labels()
    _rebuild_gate()


func _reset_configuration() -> void:
    gate_width = 4.0
    gate_height = 2.2
    slat_count = 12
    send_status_label.text = ""
    _refresh_labels()
    _rebuild_gate()
