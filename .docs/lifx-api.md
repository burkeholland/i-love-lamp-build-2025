# LIFX API Documentation

## Base URL
All endpoints are relative to: `https://api.lifx.com/v1`

## Authentication
All requests require authentication via a LIFX API token in the Authorization header.

## Endpoints

### Lights

#### List Lights
- **Method**: GET
- **Path**: `/lights/{selector}`
- **Description**: Gets lights belonging to the authenticated account. Filter the lights using selectors.
- **Parameters**:
  - `selector` (path): Filter lights by id, label, group or location

#### Set State
- **Method**: PUT
- **Path**: `/lights/{selector}/state`
- **Description**: Sets the state of the lights within the selector
- **Parameters**:
  - `selector` (path): Target selector
  - `power` (optional): "on" or "off"
  - `color` (optional): Color string
  - `brightness` (optional): 0.0 to 1.0
  - `duration` (optional): Time in seconds for the transition
  - `infrared` (optional): 0.0 to 1.0
  - `fast` (optional): Skip state checks for faster operation

#### Set States
- **Method**: PUT
- **Path**: `/lights/states`
- **Description**: Set multiple states across multiple selectors in a single request
- **Parameters**:
  - `states`: Array of state objects containing selector and state parameters
  - `defaults` (optional): Default values for all states

### Effects

#### Breathe Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/breathe`
- **Description**: Performs a breathe effect by slowly fading between colors

#### Pulse Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/pulse`
- **Description**: Performs a pulse effect by quickly flashing between colors

#### Morph Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/morph`
- **Description**: Performs a morph effect on tiles

#### Move Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/move`
- **Description**: Moves the current pattern across a linear device with zones

#### Flame Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/flame`
- **Description**: Performs a flame effect on tiles

#### Clouds Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/clouds`
- **Description**: Performs a clouds effect on tiles

#### Sunrise Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/sunrise`
- **Description**: Performs a sunrise effect on tiles

#### Sunset Effect
- **Method**: POST
- **Path**: `/lights/{selector}/effects/sunset`
- **Description**: Performs a sunset effect on tiles

#### Effects Off
- **Method**: POST
- **Path**: `/lights/{selector}/effects/off`
- **Description**: Turns off any running effects on the devices
- **Parameters**:
  - `power_off` (optional): Also power off the lights

### Power Control

#### Toggle Power
- **Method**: POST
- **Path**: `/lights/{selector}/toggle`
- **Description**: Toggle power state of lights

### State Management

#### State Delta
- **Method**: POST
- **Path**: `/lights/{selector}/state/delta`
- **Description**: Change light state by relative amounts
- **Parameters**:
  - `power` (optional): "on" or "off"
  - `duration` (optional): Time in seconds
  - `brightness` (optional): Relative adjustment (-1.0 to 1.0)

#### Cycle
- **Method**: POST
- **Path**: `/lights/{selector}/cycle`
- **Description**: Cycle through a list of states
- **Parameters**:
  - `states`: Array of state objects
  - `direction` (optional): "forward" or "backward"

### Scenes

#### List Scenes
- **Method**: GET
- **Path**: `/scenes`
- **Description**: Lists all scenes in user's account

#### Activate Scene
- **Method**: PUT
- **Path**: `/scenes/scene_id:{scene_uuid}/activate`
- **Description**: Activates a scene from the user's account
- **Parameters**:
  - `scene_uuid`: UUID of the scene to activate
  - `fast` (optional): Skip state checks for faster operation

### Utilities

#### Validate Color
- **Method**: GET
- **Path**: `/color`
- **Description**: Validate a color string
- **Parameters**:
  - `string`: Color string to validate

#### Clean
- **Method**: POST
- **Path**: `/lights/{selector}/clean`
- **Description**: Control clean-capable LIFX devices
- **Parameters**:
  - `duration`: Duration of clean mode
