# Arcade-feu - electron-arduino

## Description

Prototype of electron app for Gobelins Project - Arcade Feu (Temporary name)

## Getting Started

More information on the [Arduino CLI documentation](https://arduino.github.io/arduino-cli/0.20/getting-started/)

### Dependencies

- Node.js - [Install](https://nodejs.org/en/download/)
- Arduino CLI - [Install](https://arduino.github.io/arduino-cli/0.20/installation/)

### Installing

#### Connect the board to your PC

```bash
# Update the local cache of available platforms and libraries
arduino-cli core update-index
```

Connect the Arduino board via USB

```bash
# Show devices connected to your computer
arduino-cli board list
```

Spot your arduino board and store the port and FQBN (if detected) somewhere, you'll need it soon.

If you cant find the FQBN, try to find it online by Arduino model / version...

### Install the core for your board

Install the core you need depending on your board
Example: if your FQBN is "arduino:avr:nano" run

```bash
arduino-cli core install arduino:avr
```

### Configure build script

We created a node script to make it easier to compile and upload your code to Arduino.
Create a .env file at the root of the project, add your port and FBQN strings. example:

```env
PORT=/dev/cu.usbserial-14310
FQBN=arduino:avr:nano:cpu=atmega328old
```

### Build

Start by installing node modules

```bash
npm install
```

## Authors

[@LPGeneret](https://twitter.com/LPGeneret)
[@sergebocancea](https://twitter.com/sergebocancea)
[@leochocolat](https://twitter.com/leochocolat)
