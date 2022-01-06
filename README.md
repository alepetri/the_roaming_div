# The Roaming Div
A simple js class that allows divs to roam around their container!

![The Roaming Div Demo](./demo/assets/roaming_div.gif)

## Tunable Initialization
| Parameter | Default Value |
| :-: | :-:|
| Container Div | *immeadiate parentNode* |
| FPS | *60* |
| Speed  | *100 pixels/sec* |
| Initial Heading (deg) |  *random direction* |
| Degrees to Turn while Turning | *2 deg* |
| How Often it Changes Direction | *10%* |

## Methods
- stopRoam()
    - Use with ```mouseover()``` to pause the roaming for buttons
- startRoam()
    - Use with ```mouseleave()``` to continue roaming


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
