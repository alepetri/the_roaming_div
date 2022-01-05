# The Roaming Div
A simple js class that allows divs to roam around their container!

![The Roaming Div Demo](./demo/assets/roaming_div.gif)

## Tunable Settings
- FPS
- Speed (pixels/sec)
- Initial Heading (deg)
- Degrees to Turn while Turning (deg)
- How Often it Changes Direction (pct)

## Use
1. Include the file

    ```html
    <script type="text/javascript" src="../roaming_div.js"></script>
    ```
2. Create the object

    ```html
    <script>
        var my_roaming_div = new RoamingDiv(
            document.getElementById('a'), // div to roam
            document.getElementById('b'), // container
        );
    </script>
    ```

*Check out `demo/roaming_div.html` for an example!*


## TODOs:
- Add stop/start functionality to allow pause upon hoverover