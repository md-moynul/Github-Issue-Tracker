const allBtn = document.getElementById('allBtn');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const cardContainer = document.getElementById('cardContainer');
const spinner = document.getElementById('spinner');
const total = document.getElementById('total');

const modalDetails = document.getElementById('modalDetails');
let all = [];
let open = [];
let close = [];

function displayLabels(arr){
    const HtmlEle = arr.map(el=> `<span class='bg-red-100 py-1.5 px-2 rounded-xl font-medium text-red-500 text-xs '>${el}</span>`)
    return (HtmlEle.join(" "))
}
function loadingSpinner(status) {
    if (status === true) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}
function toggle(id) {
    const selected = document.getElementById(id);
    allBtn.classList.remove('btn-primary');
    openBtn.classList.remove('btn-primary');
    closeBtn.classList.remove('btn-primary');

    allBtn.classList.add('bg-base-100');
    openBtn.classList.add('bg-base-100');
    closeBtn.classList.add('bg-base-100');

    selected.classList.remove('bg-base-100');
    selected.classList.add('btn-primary');
    if (id === 'openBtn') {
        loadingSpinner(true); 
        displayData(open);
    } else if (id === 'closeBtn') {
        loadingSpinner(true)
        displayData(close);
    } else if (id === 'allBtn') {
        loadingSpinner(true);
        displayData(all);
    }
}

async function loadData() {
    loadingSpinner(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();

    data.data.forEach(element => {
        all.push(element)
        if (element.status === 'open') {
            open.push(element);
        } else {
            close.push(element);
        }
    });
    displayData(data.data);

}

function displayData(data) {
    cardContainer.innerHTML = '';
    data.forEach(element => {


        const newCard = document.createElement('div');
        if (element.status === 'open') {
            newCard.className = ('border-t-green-500 bg-base-100 rounded-xl  border-t-[3px]   shadow ')
        } else if (element.status === 'closed') {
            newCard.className = ('border-t-[#A855F7] bg-base-100 rounded-xl  border-t-[3px]   shadow ')
        }
        newCard.innerHTML = `
        <div onclick="modal('${element.id}')" class="">
                        <div class="p-4 shadow space-y-3">
                            <div class="p-4 shadow space-y-3 h-50">
                                <div class="flex justify-between">
                                    <div>
                                        <img src="./assets/Open-Status.png" alt="">
                                    </div>
                                    <p class="bg-red-100 py-1 px-2 rounded-xl text-xs  text-red-500 font-medium">
                                        ${element.priority}</p>
                                </div>
                                <div class="space-y-2">
                                    <h2 class="font-semibold text-[16px] h-12">${element.title}</h2>
                                    <p class="line-clamp-2 text-[14px] text-gray ">${element.description}</p>
                                </div>
                                <div class="flex gap-1">
                                    ${displayLabels(element.labels)}
                                </div>

                            </div>
                            <div class="p-4 space-y-2">
                                <p class="text-xs text-gray ">#${element.id} by ${element.author}</p>
                                <p class="text-xs text-gray ">${element.createdAt.slice(0, 10)}</p>
                            </div>
                        </div>



                    </div>
        `
        cardContainer.appendChild(newCard);


    })
     total.innerText = cardContainer.children.length;
    loadingSpinner(false);

}
async function modal(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const result = await res.json();
    const data = result.data;
    const newModal = document.createElement('div');
    modalDetails.innerHTML = ''



    newModal.className = 'space-y-6'
    newModal.innerHTML = `
        <h3 id="modalTittle" class="text-2xl font-bold">${data.title}</h3>
                            <div class="flex items-center space-x-2">
                                <p id="modalStatus"  class="px-4 py-2 text-xs text-white rounded-full">${data.status}
                                </p>
                                <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                                <p>
                                    Opened by <span>${data.author}</span>
                                </p>
                                <span class="w-1 h-1 bg-[#64748B] rounded-full"></span>
                                <p id="modalDate">
                                    ${data.createdAt.slice(0, 10)}
                                </p>
                            </div>
                            <p id="modalDes" class="line-clamp-2 text-[14px] text-gray ">${data.description}</p>
                            <div class="flex">
                                <div class="w-[50%] space-y-2.5">
                                    <p class="text-gray ">
                                        Assignee:  
                                    </p>
                                    <p id="modalNameB" class="font-semibold">
                                    ${data.assignee  ? data.assignee :data.author }
                                    </p>
                                </div>
                                <div class="space-y-2.5">
                                    <p class="text-gray ">
                                        Priority:
                                    </p>
                                    <p id="modalPriority" class="bg-red-500 text-white px-4 py-1.25 rounded-full ">
                                    ${data.priority}
                                    </p>
                                </div>
                            </div>
                        
    `
    modalDetails.appendChild(newModal)
    const modalStatus = document.getElementById('modalStatus');
    if (data.status === 'open') {
        modalStatus.classList.add('bg-green-500')
    } else if (data.status === 'closed') {
        modalStatus.classList.add('bg-red-500')
    }

    boxModal.showModal()
}
loadData();
