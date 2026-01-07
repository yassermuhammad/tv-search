# How to Access the App on Your Phone from Localhost

## Step 1: Make Sure Your Phone and Computer are on the Same Wi-Fi Network

Both devices must be connected to the same Wi-Fi network.

## Step 2: Find Your Computer's Local IP Address

### On macOS:
1. Open **System Settings** → **Network**
2. Select your Wi-Fi connection
3. Your IP address will be shown (e.g., `192.168.1.100`)

Or run in Terminal:
```bash
ipconfig getifaddr en0
```

### On Windows:
1. Open **Command Prompt** or **PowerShell**
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your Wi-Fi adapter (e.g., `192.168.1.100`)

### On Linux:
```bash
hostname -I | awk '{print $1}'
```

## Step 3: Start the Dev Server

The Vite config is already configured to allow external connections. Just run:

```bash
yarn dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

## Step 4: Access from Your Phone

1. **Open your phone's browser** (Chrome, Safari, etc.)
2. **Type the Network URL** shown in the terminal:
   ```
   http://192.168.1.100:5173
   ```
   (Replace `192.168.1.100` with your actual IP address)

3. **The app should load** on your phone!

## Troubleshooting

### Can't connect?
- ✅ Make sure both devices are on the same Wi-Fi network
- ✅ Check that your firewall isn't blocking port 5173
- ✅ Verify the IP address is correct
- ✅ Try disabling VPN if you're using one

### Firewall Settings (macOS):
If you get a firewall prompt, click "Allow":
1. System Settings → Network → Firewall
2. Allow incoming connections for Node/Vite

### Firewall Settings (Windows):
1. Windows Defender Firewall → Allow an app
2. Add Node.js or allow port 5173

## Testing PWA Installation on Phone

Once you can access the app on your phone:
1. Open the app in your mobile browser
2. Look for the "Add to Home Screen" prompt
3. Or use browser menu → "Add to Home Screen"
4. The app will install with the custom icon!

## Quick Reference

- **Local URL**: `http://localhost:5173` (computer only)
- **Network URL**: `http://YOUR_IP:5173` (accessible from phone)
- **Port**: 5173 (default Vite port)

