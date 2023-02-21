import { projects } from "./projects.js";

const projectList = document.getElementById('projectList');
const searchBar = document.getElementById('searchBar');
const baseURL = './view.html';
console.log(projects)

//search bar
searchBar.addEventListener('keyup', (e) => {
//search element by name or category and display it in the project list (search bar)
    const search = e.target.value.toLowerCase();
    const elements = document.querySelectorAll('.element');
    elements.forEach(element => {
        const name = element.querySelector('.property-description').innerText.toLowerCase();
        const category = element.querySelector('.property-description').innerText.toLowerCase();
        if (name.includes(search) || category.includes(search)) {
            element.style.display = 'block';
          } else {
            element.style.display = 'none';
             }
    });
}
);

const loadProjects = async () => {
    try {
        displayElements(projects);
    } catch (err) {
        console.error(err);
    }
};

const displayElements = (elements) => {
for (let i = 0; i < elements.length; i++) {
    const project = elements[i];
    const projectElement = document.createElement('div');
    projectElement.classList.add('category');
    projectElement.innerHTML = `
     
    <div class="tittle" style="width:100%">
    <h1 id="${project.category}">${project.category}</h1> 
        </div>
    
    `;
    projectList.append(projectElement);

    let elementsExist = false;
    for(let j = 0; j < project.elements.length; j++) {
        const element = project.elements[j];
        const elementElement = document.createElement('div');
        elementElement.classList.add('element');
        elementElement.innerHTML = `
        <li>
        <div class="property-card">
           <a href=${baseURL}?model=${element.url}&ficha=${element.ficha}>
           <div class="property-image" style="background-image:url(${element.imagen})">
               <div class="property-image-title" >
               <h5 class="name">${element.name}</h5>
               </div>
           </div></a>
           <div class="property-description">
           <h5> ${element.name} </h5>
           <p class="lod">${element.lod}</p>
           </div>       
           <a href="#">
           </a>
       </div>
       </li>
       </div>
        `;
        projectElement.appendChild(elementElement);
        elementsExist = true;
    }

    if (!elementsExist) {
        
        projectElement.style.display = 'none'
    }
}
}

loadProjects();