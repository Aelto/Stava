# Stava
League of Legends Game analyst.

# Preview pictures
![home page](/pictures/Capture.PNG?raw=true "Home page")
![loading screen](/pictures/Capture_1.PNG?raw=true "Loading screen")
![runes & masteries](/pictures/Capture_2.PNG?raw=true "Runes & masteries")

# Get Stava
download the latest release archive from the [releases](https://github.com/Aelto/Stava/releases)

# Configure Stava
> A bit of configuration is needed to get it work, this section will let you know what is the needed setup before you can freely use the app.

## Riot Games API key
the app is not a registered app yet, so i can't use my own API key to do all the requests to the [Riot Games API](https://developer.riotgames.com/). You'll have to create one.
 - Go to [developer.riotgames.com](https://developer.riotgames.com/) which is a sub domain of riotgames.com where you can sign in with the same username/password you use for your standard riotgames account.
 - You should land on a page with a section named **My Development API key** with a button **new api key**, use that and you'll get a new api key (do not share the api key to anybody you don't trust)

You now have this so-important api key. During stava first-launch (or in the stava's home page) there will be an input asking for your API key, just copy-paste it inside it.
 
## Location of the League Of Legends folder
to save bandwidth Stava uses the images such as champion splashes or masteries icons located in the League Of Legends folder. To supply your LoL folder location to Stava, click the settings button (gear icon) on the right top corner which will open the settings page. On that page you should see an input labeled **Path to your League of Legends folder**, simply enter the path the the League of Legends directory (my path was, for example, `D:\Program\League Of Legends`).
 
## That's it!
You can now use Stava. By running the `Stava.exe`

# Build from the sources
Clone the repo then install the dev dependencies with `yarn install` or `npm install`, then rebuild the bundles with `yarn build` or `npm run build`. The app can be started with `yarn start` or `npm start`. You can package the app with `yarn packager` or `npm run packager`
