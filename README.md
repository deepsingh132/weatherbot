# 🌦️ WeatherBot

This **WeatherBot** is a Telegram bot that provides users with real-time weather updates and personalized location-based forecasts. It is powered by the OpenWeatherMap API and offers a seamless experience for users to get weather information instantly.

Additionally, the project includes an **admin control panel backend** for managing user preferences, locations, and bot functionality.

Built with the lightweight and robust **grammY** framework for Telegram bot development, the bot is designed to handle user interactions efficiently, while the server handles data validation, persistence, and API integrations.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Bot Commands](#bot-commands)
- [License](#license)

---

## Features

### Bot Features:

- **Real-Time Weather Updates**
  Users can query the bot for live weather data, including temperature, humidity, and conditions.

- **Personalized Location-Based Forecasts**
  Users can set their preferred locations and receive forecasts for those locations.

- **Natural Language Interaction**
  Users can input city names, and the bot will validate and respond conversationally.

### Admin Panel Features:

- **Location Validation**
  Checks the validity of user-provided locations using OpenWeatherMap’s Geocoding API before saving them.

- **User Management**
  Admins can view and manage user data and preferences through an intuitive control panel.

- **Error Handling**
  Ensures smooth operation by handling invalid data, network issues, and API errors gracefully.

---

## Technologies Used

### Bot
- **[grammY](https://grammy.dev/)**: A robust Telegram bot framework for handling bot interactions.
- **OpenWeatherMap API**: Fetches weather data and validates locations.

### Server
- **Node.js**: Backend runtime environment.
- **TypeScript**: Strongly typed programming language.
- **Express.js**: Fast and lightweight web framework.
- **Mongoose**: MongoDB Object Modeling for Node.js.
- **MongoDB**: Database for storing user preferences and data.
- **dotenv**: For environment variable management.

---

## Screenshots

![Screenshot_20241126-081047](https://github.com/user-attachments/assets/d15029c0-c42f-4ae7-8727-f1b7215e501d)


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A valid [OpenWeatherMap API Key](https://openweathermap.org/api)
- A Telegram bot token from [BotFather](https://t.me/BotFather)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/deepsingh132/weatherbot.git
   cd weatherbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables)).

4. Start the server and bot:
   ```bash
   npm run start
   ```

---

## Environment Variables

Set up the following keys in a `.env` file:

```env
PORT=5000
OPENWEATHER_API_KEY=your_openweathermap_api_key
MONGODB_URI=your_mongodb_connection_string
BOT_TOKEN=your_telegram_bot_token
TOKEN_SECRET=your_token_secret (any random string)
```

---

## Bot Commands

| Command            | Description                              | Example                     |
|---------------------|------------------------------------------|-----------------------------|
| `/start`           | Starts interaction with the bot.         | `/start`                    |
| `/current <city>`  | Fetches current weather for a city.      | `/current New York`         |
| `/subscribe`     | Saves a preferred location.              | `/subscribe`     |
| `/unsubscribe`     | Removes a saved location                   | `/unsubscribe`              |
| `/update_city`  | Configures location updates.                | `/update_city`  |
| `/update_frequency`  | Configures frequency updates.                | `/update_frequency`  |
| `/help`            | Displays help information.               | `/help`                     |
| `/about`           | Provides information about the bot.      | `/about`                    |

---

## License

This project is licensed under the GPL v3 License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed with ❤️ by **Mandeep Singh**
- [LinkedIn](https://linkedin.com/in/deepsingh132)
- [GitHub](https://github.com/deepsingh132)

---
