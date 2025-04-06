# Model Rocket Control Station

This is a model rocket control program built with TypeScript and the @material/web component library. The application provides a user interface for monitoring and controlling various parameters and functions of model rockets.

## Features

- **Real-time Telemetry Data Monitoring**: Display of key data such as altitude, speed, acceleration, and temperature
- **Sensor Data Viewing**: View data from accelerometer, gyroscope, barometer, and GPS sensors
- **System Settings**: Configure connection, telemetry, and launch parameters
- **Device Connection Management**: Connect and disconnect communication with the rocket
- **Responsive Design**: Adapts to different screen sizes
- **Multi-language Support**: Supports English, Simplified Chinese, and Traditional Chinese

## Technology Stack

- **TypeScript**: Provides type safety and better development experience
- **@material/web**: Web Components implementation of Material Design 3
- **Vite**: Modern frontend build tool
- **CSS Grid & Flexbox**: Used for responsive layouts

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
model-rocket-station/
├── src/
│   ├── modules/           # TypeScript modules
│   │   ├── connection.ts  # Connection management
│   │   ├── navigation.ts  # Navigation management
│   │   ├── sensors.ts     # Sensor data management
│   │   ├── settings.ts    # Settings management
│   │   ├── i18n.ts        # Internationalization
│   │   └── telemetry.ts   # Telemetry data management
│   ├── styles/            # CSS style files
│   │   └── main.css       # Main style file
│   └── main.ts            # Main entry file
├── index.html             # HTML entry file
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Project configuration and dependencies
```

## Customization

You can customize the application by modifying the following files:

- `src/styles/main.css`: Modify styles and theme colors
- `index.html`: Modify page structure
- `src/modules/`: Modify implementation of functional modules

## Notes

This is a simulation application and does not include communication functionality with actual hardware. In a real application, you would need to implement the communication protocol with the rocket hardware.
