# Boilerplate Electron Web App

This is a modification of [electron-quick-start](https://github.com/electron/electron-quick-start). `main.js` has been preloaded with some features frequently needed for always-on kiosk applications (error recovery, guaranteed execution order of server-client startup, lockdown). These features are exposed for customization in `config.json`.

## Setup

To initialize

	npm install

If you need to build for the Windows platform from a Mac computer

	brew install wine

In `package.json`:

- replace `APP_NAME` in "name", "build:win", "build:mac", and "build:copyClient" with a lower-case, hyphenated app name
- replace `APP_DESCRIPTION` in "description"
- replace `$USER` and `$TARGET_MACHINE` in "deploy" (optional if using ssh to deploy on local network) 
- replace `$SERVER`, `$STAGING_FOLDER`, and `$DEPLOY_FOLDER` in "aws:upload", "aws:config", and "aws:move" (option if deploying to aws)

In `app/sw.js`:

- replace $APP_NAME

In `app/js/app.js`:

- add assets you want the service worker to cache to the assets array

In `app/index.html`:

- replace $APP_NAME

In `config.json`:

- replace "url" with the url of the app, whether form local filesystem or remote via http(s)

In `electron/package.json`:

- replace `APP_NAME` in "name" and "productName"

## Build

To build for Mac

	npm run buildMac

To build for Windows

	npm run buildWin

## Config Options

The `config.json` offers lots of customization options.

### `url`

To load a local website with path relative to `Contents/Resources/app`:

	{
		"url": "index.html"
	}

To load a local website with absolute path:

	{
		"url": "file:///path/to/index.html"
	}

To load a remote website:
	
	{
		"url": "http://google.com",
	}

### `debug`

To load with dev tools open:
	
	{
		"url": "http://google.com",
		"debug": true
	}

### `zoom`

By default, zoom is disabled. To re-enable:
	
	{
		"url": "http://google.com",
		"zoom": true
	}

### `browserWindow`

Passed wholesale to [Electron's BrowserWindow constructor](https://github.com/electron/electron/blob/master/docs/api/browser-window.md). See their documentation for all options.

The most useful options include initial `x`, `y`, `width`, and `height`, as well as flags to toggle whether the browser window will be `fullscreen`, `resizable`, `moveable`, `minimizable`, `maximizable`, `closable`, in `kiosk` mode, and/or `alwaysOnTop`.

Note: to use jQuery, you need to disable Electron's node integration via `webPreferences.nodeIntegration=false`. More info at [http://electron.atom.io/docs/v0.36.8/faq/electron-faq/#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron](http://electron.atom.io/docs/v0.36.8/faq/electron-faq/#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron).

	{
	  "url": "http://www.google.com",
	  "debug": true,
	  "browserWindow": {
	    "x":0,
	    "y":0,
	    "width": 1280,
	    "height": 720,
	    "fullscreen": false,
	    "resizable": false,
	    "moveable": false,
	    "minimizable": false,
	    "maximizable": false,
	    "closable": false,
	    "kiosk": false,
	    "alwaysOnTop": true,
	    "webPreferences": {
	      "nodeIntegration": false
	    }
	  }
	}

### `commandLineSwitches`

Some Chrome command line switches can be passed through. More info at [https://github.com/electron/electron/blob/fa271204293865ee6ff3a7013659dca659bdd121/docs/api/chrome-command-line-switches.md](https://github.com/electron/electron/blob/fa271204293865ee6ff3a7013659dca659bdd121/docs/api/chrome-command-line-switches.md).

	{
	  "url": "http://www.google.com",
	  "commandLineSwitches": {
	    "remote-debugging-port":"8315"
	  }
	}

### `launchDelay` and `kioskDelay`

You can delay the app's initial launch, and the app's activation of kiosk mode, in case you need to wait for other tasks to complete, or if you encounter this issue: [https://github.com/atom/electron/issues/1054#issuecomment-173368614](https://github.com/atom/electron/issues/1054#issuecomment-173368614).

	{
	  "url": "http://www.google.com",
	  "debug": true,
	  "launchDelay": 1000,
	  "kioskDelay": 100,
	  "browserWindow": {
	    "kiosk": true
	  }
	}

### `reloadTimeout`

If Electron encounters an error ([unresponsive](https://github.com/electron/electron/blob/71f94c7a3ad1014a0c1fdca248046c4d61cb3988/docs/api/browser-window.md#event-unresponsive), [did-fail-load](https://github.com/electron/electron/blob/71f94c7a3ad1014a0c1fdca248046c4d61cb3988/docs/api/web-contents.md#event-did-fail-load), [crashed](https://github.com/electron/electron/blob/71f94c7a3ad1014a0c1fdca248046c4d61cb3988/docs/api/web-contents.md#event-crashed), [plugin-crashed](https://github.com/electron/electron/blob/71f94c7a3ad1014a0c1fdca248046c4d61cb3988/docs/api/web-contents.md#event-plugin-crashed)) it will attempt to reload the page on an interval equal to `reloadTimeout` measured in milliseconds.

	{
	  "url": "http://www.google.com",
	  "reloadTimeout": 3000
	}

### `resizeTimeout` and `bounds`

If `bounds` is specified, the web app is assumed *not* to be fullscreened, and it will periodically ensure that it is sized to fit the specified bounds. Resizing occurs on an interval equal to `resizeTimeout` measured in milliseconds.

	{
	  "url": "http://www.google.com",
	  "resizeTimeout": 3000,
	  "bounds":{
       "x":0,
       "y":0,
       "width": 1280,
       "height": 720
     }
	}
	