import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

// Get the current project ID from the URL parameter
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");


// Add the project URL to the iframe
const elementurl = url.searchParams.get("model");
const elementFicha = url.searchParams.get("ficha");

console.log({ elementurl });

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });

const items = viewer.context.items;
const camControls = viewer.context.ifcCamera.cameraControls

camControls.setTarget(1, 1, 1)
camControls.zoom(0.1)

async function loadIfc(url) {
    await viewer.IFC.setWasmPath("./wasm/");
    const model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);
    viewer.context.renderer.postProduction.active = false;
    console.log(viewer.context)

    console.log(viewer.context.ifcCamera.cameraControls._camera.zoom)
    viewer.context.ifcCamera.cameraControls._camera.zoom = 3;
    console.log(viewer.context.ifcCamera.cameraControls._camera.zoom)

    //estructura del archivo
    const ifcProject = await viewer.IFC.getSpatialStructure(model.modelID);
    console.log(ifcProject);


    // Set the nesting level identifier based on the element URL
    let ident;
    //passing the IFCProject and IFCSite level for Buildings(containing de word "Edificio")
        try {
            ident = ifcProject.children[0].children[0].children[0].children[0].expressID;
        } catch (error) {
            ident = ifcProject.children[0].children[0].expressID;
        }
    //properties
    const properties = await viewer.IFC.getProperties(model.modelID, ident, true, false);
    console.log(properties);
    createPropertiesMenu(properties);
    document.getElementById("titulo").innerHTML = properties.Name.value;


    function createPropertiesMenu(properties) {
        removeAllChildren(propsGUI);

        const psets = properties.psets;
        const mats = properties.mats;
        const type = properties.type;

        /*     delete properties.psets; */
        delete properties.mats;
        delete properties.type;

        const psetProp = [];

        for (let key in psets) {
            for (let pset in psets[key].HasProperties) {
                propSetId = psets[key].HasProperties[pset].value;
                nameProperty(propSetId, key);
            }
        }
        /* Load the property values for the given ID and create a menu entry */
        async function nameProperty(id, key) {
            customprop = await viewer.IFC.getProperties(model.modelID, id, true, false);
            psetProp.push(customprop); //ESTO ES PRESCINDIBLE   

            createPropertyEntry(customprop.Name.value, customprop.NominalValue.value);

        }

    }
    const mod = items.ifcModels[0].id;
    const bbox = items.ifcModels[0].geometry.boundingBox;
    console.log(bbox);
    /* viewer.context.fitToFrame(); */
}

const propsGUI = document.getElementById("ifc-property-menu-root");

loadIfc(elementurl);

//Create property entries

function createPropertyEntry(key, value) {

    const propContainer = document.createElement("div");
    propContainer.classList.add("ifc-property-item");

    if (value === null || value === undefined) value = "undefined";
    else if (value.value) value = value.value;

    const keyElement = document.createElement("div");
    keyElement.textContent = key;
    propContainer.appendChild(keyElement);

    const valueElement = document.createElement("div");
    valueElement.classList.add("ifc-property-value");
    valueElement.textContent = value;
    propContainer.appendChild(valueElement);

    propsGUI.appendChild(propContainer);

}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

//Update download button

document.getElementById("descarga").href = elementurl;
document.getElementById("descargaficha").href = elementFicha;


