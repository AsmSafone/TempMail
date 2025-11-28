# TempMail 2.0 - Secure Temporary Email System

A modern, secure, and feature-rich temporary email service built with React and TypeScript. Get disposable email addresses instantly and manage your inbox with ease.

![TempMail 2.0](https://img.shields.io/badge/Version-2.0-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Core Features
- **Instant Email Generation** - Create temporary email addresses instantly
- **Real-time Inbox** - Auto-refresh every 10 seconds (customizable)
- **Message Management** - View, read, and delete emails
- **Email History** - Access previously used email addresses
- **Secure & Anonymous** - No registration required, completely anonymous

### Advanced Features
- **QR Code Generator** - Generate QR codes for email addresses
  - Mailto link QR codes (opens email client)
  - Inbox access link QR codes (shareable inbox access with secure hashing)
- **Email Sharing** - Share email addresses with others
  - Copy email address
  - Generate secure shareable inbox access links (hashed for privacy)
- **Secure Link Sharing** - Email addresses are hashed in URLs to prevent unauthorized access
- **Browser Notifications** - Get notified when new emails arrive
- **Customizable Settings** - Adjust refresh intervals (5s, 10s, 30s, 1min, 5min)
- **Keyboard Shortcuts** - Power user features for quick navigation
- **Matrix Rain Animation** - Beautiful cyberpunk-themed UI

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/AsmSafone/TempMail.git
cd TempMail
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_TEMPMAIL_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser
Navigate to `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Generate new email |
| `R` | Refresh messages |
| `S` | Open settings |
| `H` | Show email history |
| `Q` | Show QR code generator |
| `?` | Show keyboard shortcuts help |
| `Esc` | Close menus |

## 📖 Usage

### Generating an Email

1. The app automatically generates an email when you first visit
2. Click the trash icon to delete current mailbox and generate a new one
3. Or press `N` to generate a new email

### Viewing Messages

- Messages appear automatically in the inbox
- Click on any message to view full content
- Messages auto-refresh every 10 seconds (customizable in settings)
- Use the refresh button or press `R` to manually refresh

### Sharing Email Address

1. Click the share icon (📤) in the email display
2. Choose to:
   - Copy email address
   - Copy secure inbox access link (with hashed email)
   - Generate QR code with secure link

### QR Code Options

- **Mailto Link**: QR code opens email client with the address
- **Inbox Access Link**: QR code provides direct access to the inbox

### Settings

Access settings by clicking the settings icon or pressing `S`:
- Adjust auto-refresh interval
- Enable/disable browser notifications

## 🏗️ Project Structure

```
TempMail/
├── src/
│   ├── components/          # React components
│   │   ├── EmailDisplay.tsx
│   │   ├── EmailHistory.tsx
│   │   ├── KeyboardShortcuts.tsx
│   │   ├── MatrixRain.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageViewer.tsx
│   │   ├── QRCodeGenerator.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── SharePanel.tsx
│   ├── services/            # API services
│   │   ├── emailHistory.ts
│   │   └── tempmail.ts
│   ├── utils/               # Utility functions
│   │   └── emailHash.ts     # Email hashing for secure links
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🛠️ Technologies Used

- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Styling
- **Lucide React** - Icon library
- **TempMail API** - Email service API

## ⚙️ Configuration

### Environment Variables

- `VITE_TEMPMAIL_API_KEY` - Your TempMail API key (optional, has default)

### Customization

You can customize:
- Refresh intervals in settings
- Notification preferences
- UI theme (modify Tailwind classes)

## 📱 Features in Detail

### Email History
- Automatically saves used email addresses
- Access previous emails from history
- Restore any previous email address

### QR Code Generator
- Two types of QR codes:
  - **Mailto**: Opens default email client
  - **Inbox Access**: Direct link to inbox
- Adjustable size (150px - 400px)
- Download as PNG image

### Shareable Links
- Generate secure links that provide inbox access
- **Email Hashing**: Email addresses are hashed in URLs to prevent unauthorized access
- Format: `https://mail.safone.vip?hash=encoded_hash`
- Only users with the correct hash can access the inbox
- Email addresses are never exposed in URLs, browser history, or shared links

### Browser Notifications
- Get desktop notifications for new emails
- Requires browser permission
- Shows number of new emails received

## 🔒 Privacy & Security

- **No Registration** - Use without creating an account
- **Anonymous** - No personal information required
- **Temporary** - Emails are automatically deleted after 24 hours
- **Secure Link Sharing** - Email addresses are hashed in shareable links
  - Prevents unauthorized access to inboxes
  - Email addresses not visible in URLs or browser history
  - Uses base64 encoding with salt for obfuscation
- **Encrypted Communications** - All API communications are encrypted

⚠️ **Warning**: Do not use for sensitive information. This is a temporary email service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- TempMail API for email service
- React community for excellent documentation
- All contributors and users

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by Safone**

