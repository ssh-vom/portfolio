# Controller illustration references

`src/components/ControllerStudy.jsx` is a simplified SVG, not a manufacturing drawing or a direct mesh render.

## Local source inspected

`../openarcade/config_app/public/TP1_B_0_BUTTON.glb`

GLB node transforms and POSITION accessor bounds were composed into world-space bounding boxes (millimeters):

- `Rev1_8Button:1`: 180 × 180 mm footprint; 55 mm enclosure depth.
- `Perfboard:1`: 70 × 50 mm, centered at x = -0.5, z = -40.5.
- `ESP32_DevKitV1:1`: approximately 51 × 28 mm, mounted over the perfboard.
- `batterypack:1`: 64 × 60 mm footprint, centered at x = 0, z = 52.5.
- Eight `button_*` assemblies: centers used directly for the SVG layout; 35 mm outer diameter.
- `small_1`, `small_2`, `small_3`: three auxiliary inputs.
- `largemag:*`: cylindrical magnets oriented into the vertical side walls, not through the lid. The right-side group is centered around x = 88.3 mm, y = -30 mm, with z spacing of 30 mm.
- `PerfboardAssy:1` includes eight JST connectors, pin headers, capacitor and resistors; the SVG deliberately omits fine component placement rather than inventing PCB traces.

The Rev 0 child-module schematic also identifies ESP32-WROOM-32D, eight main buttons, auxiliary switches, battery supply, and OLED connections.

## Video reference

`public/videos/openarcade.mp4`, approximately 12–28 seconds, shows the detachable magnetic strip, side rail, eight-button face, and paired modules.

## Deliberate simplifications

The SVG uses schematic extrusion depths and an illustrative rail cross-section. Its connector is a cutaway so the inward-facing magnet set is visible from the chosen viewpoint. The mating strip and rail motion are inferred from the video and the owner's description; they are not measured from a standalone connector mesh. Exact mating tolerances, wiring routes, fasteners, and PCB artwork are not represented.

Animation phases: slide along rail → separate sideways → explode internals → reassemble internals → align sideways → slide home → lift eight-button layout → fit joystick/four-button layout → return eight-button layout. Runs automatically as a 22-second loop, independent of scrolling, without playback controls or a pinned section. Reduced motion disables autoplay.

The alternate layout references `TP1_A_0_JOYSTICK.glb`: four `button_*` centers and the Sanwa JLF assembly bounding-box center inform the simplified controls. The illustration exchanges the complete upper layout for visual clarity; the actual CAD separates the joystick housing and removable button plate. This is a conceptual configuration change, not a demonstration of hot-swapping live electrical connections. Caps are slightly undersized for legibility, drawn back-to-front with continuous cylindrical sides to avoid overlapping rim artifacts.
