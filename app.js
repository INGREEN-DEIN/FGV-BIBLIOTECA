import THREE, { BoxGeometry, Material, Mesh, Vector3 } from 'three'
import CameraControls from 'camera-controls';
import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

// Get the current project ID from the URL parameter
const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");



// Get the current project
/* const currentProject = projects.find(project => project.elements.id === currentProjectID); */



// Add the project URL to the iframe
const elementurl = url.searchParams.get("model");
const elementFicha = url.searchParams.get("ficha");
/* console.log({ "la url" }); */

console.log({ elementurl });

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
/* viewer.grid.setGrid(); */
/* viewer.axes.setAxes(); */

const camara = viewer.context.getCamera();
const escena = viewer.context.getScene();
const items = viewer.context.items;
const camControls = viewer.context.ifcCamera.cameraControls

camControls.setTarget(1,1,1)
camControls.zoom(0.1)

/*     geom.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter( center);
    items.localToWorld( center); */




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
    /*   createTreeMenu(ifcProject); */

    //const ident = ifcProject.children[0].children[0].children[0].children[0].expressID
    //const ident = ifcProject.children[0].children[0].expressID
    let ident;
    try {
      ident = ifcProject.children[0].children[0].children[0].children[0].expressID;
    } catch (error) {
      ident = ifcProject.children[0].children[0].expressID;
    }
    //propiedades
    const properties = await viewer.IFC.getProperties(model.modelID, ident, true, false);
    /*   console.log(properties); */
    createPropertiesMenu(properties);
    document.getElementById("titulo").innerHTML = properties.Name.value;


    function createPropertiesMenu(properties) {
        /*         console.log(properties.Name.value); */


        removeAllChildren(propsGUI);

        const psets = properties.psets;
        const mats = properties.mats;
        const type = properties.type;

        /*     delete properties.psets; */
        delete properties.mats;
        delete properties.type;


        const psetID = [];
        const psetProp = []; //ESTO ES PRESCINDIBLE

        for (let key in psets) {
            /*    createHeadEntry(psets[key].Name.value); */
            for (let pset in psets[key].HasProperties) {
                propSetId = psets[key].HasProperties[pset].value;
                nameProperty(propSetId, key);


            }
            /*            console.log("Este es el psetID", psetID) */
        }
        /* funcion que autoselecciona el modelo cargado y carga los psets a la lista psetProp*/
        async function nameProperty(id, key) {

            /*         console.log(psets[key].Name.value) */

            /*      createPropertyEntry(key, psets[key].Name.value);    */

            customprop = await viewer.IFC.getProperties(model.modelID, id, true, false);
            psetProp.push(customprop); //ESTO ES PRESCINDIBLE   

            /*  console.log("Desde Name proprerty", psets[key].Name.value, [customprop.Name.value, customprop.NominalValue.value]); */

            createPropertyEntry(customprop.Name.value, customprop.NominalValue.value);

        }
   console.log(psets)
        

    }
    const mod = items.ifcModels[0].id;
    const bbox = items.ifcModels[0].geometry.boundingBox;
    console.log(bbox);
    /* viewer.context.fitToFrame() */
    escena.lookAt(0,0,0)
    console.log(camara)

    console.log(items)

}

const propsGUI = document.getElementById("ifc-property-menu-root");



loadIfc(elementurl);



//Crear entradas de propiedades

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

//actualiza botón descargar

document.getElementById("descarga").href = elementurl;
document.getElementById("descargaficha").href = elementFicha;


