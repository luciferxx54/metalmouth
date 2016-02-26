# Document to record living ideas #

## Changes to architecture ##

Checked (21/3) - a browser action and a content script can be referenced in the same manifest.

We inject a content script at (document start) which:

1) Decides whether or not to load a metalmouth-speakcr-nodeCode file - again at (document start).  The decision is - inject if metalmouth-speakcr is on.

Taking this approach keeps the code loaded into each matching page via the content script as small as possible.

2) The metalmouth-speakcr-nodeCode creates a DOM Observer - which has two jobs:

The first is to recognise when the HEAD element has been created, and then create a SCRIPT element as the first element in the HEAD element - the SCRIPT element contains code which changes the addEventListener function.

The second is to recognise element nodes (as there are created) for which voice models will be created in the Off-Screen Model (OSM).  Each node will be made focusable by adding tabindex=-1.

### Additional note ###

These changes should also mean that we could remove the DOMWalker.  As the available elements would always be available.  You could search for headers etc... directly.  This would make the code lighter.

As now, the arrows would be used to navigate to OSM items, however, we getFocus when an item is reached using .focus() and loose focus when navigated away from using .blur(). This means that we can remove the outline style which we currently apply - as the inherent focus highlighter should be enough.

## Developer mode ##

When metalmouth-speakcr is switched off (by some key combination, or button on toolbar) an option will become available in the context menu to "test page with metalmouth-speakcr" i.e. developer mode.