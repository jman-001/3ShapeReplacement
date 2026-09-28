# 3Shape Replacement

Static internal support site with a replacement form, reference pictures,
installer links, and a placeholder area for support tools and commands.

## Project structure

- `index.html`: landing page.
- `pages/replacement.html`: replacement form.
- `pages/reference-pictures.html`: searchable picture gallery.
- `pages/installers.html`: installer links grouped by product family.
- `pages/resources.html`: public files and external resources.
- `pages/tools-commands.html`: private support tools and commands.
- `data/installers.json`: products, Unite generations, releases, and module downloads.
- `data/reference-pictures.json`: scanner models and their reference pictures.
- `data/resources.json`: public resource catalog.
- `data/tools-commands.json`: Support Mode catalog.
- `data/file-types.json`: shared file-type and action dictionary.
- `js/header.js`: shared navigation and Support Mode trigger.
- `js/catalog.js`: shared Resources and Tools & Commands renderer.
- `js/replacement.js`: replacement form interactions.
- `css/global.css`: shared design tokens and browser defaults.

`main.js` and `navigation.js` are intentionally kept as empty placeholders.

## Run locally

The project has no build step or external dependencies. Serve the repository
with any local HTTP server instead of opening the files directly.

Using the included PowerShell server:

```powershell
./serve.ps1
```

For everyday use, `launch-site.ps1` starts the server in the background only
when needed and opens the site in the default browser. The Windows desktop
shortcut uses this launcher.

Then open `http://localhost:8000`.

Do not open the HTML files directly with `file://`. Browsers assign local files
isolated origins and block the `fetch()` requests used to load the JSON
catalogs. This restriction does not apply when using localhost or GitHub
Pages.

Using Visual Studio Code, the repository can also be opened with the Live
Server extension.

## Publishing with GitHub Pages

1. Push the desired branch to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the branch to publish and the `/ (root)` folder.
6. Save and wait for GitHub to display the published URL.

All application links are relative to the repository root and work when the
site is hosted under a GitHub Pages project path.

## Updating installers

Installer content is generated from `data/installers.json`. The hierarchy is:

```text
product → modules + generations → releases → downloads
```

To add a new release, add it to the appropriate generation:

```json
{
  "version": "1.9.0.0",
  "downloads": [
    {
      "module": "unite",
      "url": "https://example.com/unite-installer"
    },
    {
      "module": "trios",
      "moduleVersion": "1.20.0.0",
      "url": "https://example.com/trios-installer"
    }
  ]
}
```

To introduce another module, first add its ID and display name to the
product's `modules` list. That ID can then be used by any release without
changing the HTML or JavaScript.

The four 3Shape Unite generations are already represented. Unite IV is empty
until its first installer is added.

## Updating reference pictures

Reference content is generated from `data/reference-pictures.json`. Each
scanner model owns its `pictures` list:

```json
{
  "id": "new-scanner",
  "name": "New Scanner",
  "pictures": [
    {
      "title": "Scanner - Front",
      "image": "../assets/images/reference/new-scanner/front.jpg",
      "description": "Front view of the scanner."
    }
  ]
}
```

Adding another object to `models` automatically creates its filter and gallery
entries. Image files belong under `assets/images/reference/`.

## Updating Resources and Tools & Commands

Both pages use the same catalog renderer and JSON structure. Public entries
belong in `data/resources.json`; support-only entries belong in
`data/tools-commands.json`.

Local public files belong under `assets/files/resources/`. Local support files
belong under `assets/files/tools/`.

### Local download

Paths are resolved relative to the JSON file:

```json
{
  "id": "replacement-guide",
  "category": "guides",
  "title": "Replacement Guide",
  "description": "Instructions for replacement cases.",
  "tags": ["replacement", "guide"],
  "platforms": [],
  "version": "1.0",
  "actions": [
    {
      "type": "download",
      "source": "local",
      "label": "Download PDF",
      "target": "../assets/files/resources/replacement-guide.pdf"
    }
  ]
}
```

### External URL

```json
{
  "id": "external-resource",
  "category": "external",
  "title": "External Resource",
  "description": "Resource hosted outside this site.",
  "actions": [
    {
      "type": "open",
      "source": "external",
      "label": "Open resource",
      "target": "https://example.com/resource"
    }
  ]
}
```

### Copyable command

```json
{
  "id": "diagnostic-command",
  "category": "commands",
  "title": "Diagnostic Command",
  "description": "Collects diagnostic information.",
  "platforms": ["Windows"],
  "content": {
    "type": "command",
    "value": "command --example"
  },
  "actions": [
    {
      "type": "copy",
      "label": "Copy command"
    }
  ]
}
```

An item may have multiple actions. Set `"enabled": false` to keep an entry in
the JSON without displaying it.

Support Mode is currently a user-interface restriction only. Files committed
under `assets/files/tools/` can still be reached through their direct URL on a
public deployment. Sensitive tools should eventually use authenticated
external storage.

## Support Mode

Support Mode currently uses a client-side password and `sessionStorage` for
practical development use. It only hides navigation items and must not be
treated as access control. Real authentication should be added before relying
on it to protect internal content.

## Form data

Replacement form values are stored only in the user's browser under the
`replacement-form:v1` local storage key. Resetting the form removes that saved
data.
