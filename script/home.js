const allBtn = document.getElementById('allBtn');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const cardContainer = document.getElementById('cardContainer');
const spinner = document.getElementById('spinner');
const total = document.getElementById('total');
const inputSearch = document.getElementById('inputSearch');
const btnSearch = document.getElementById('btnSearch');

const modalDetails = document.getElementById('modalDetails');
let all = [];
let open = [];
let close = [];

function displayLabels(arr) {
    const HtmlEle = arr.map(el => `<span class='bg-yellow-200 py-1.5 px-2 rounded-xl font-medium text-red-500 text-xs '>${el}</span>`)
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
        inputSearch.value = '';
        loadingSpinner(true);
        displayData(open);
    } else if (id === 'closeBtn') {
        inputSearch.value = '';
        loadingSpinner(true)
        displayData(close);
    } else if (id === 'allBtn') {
        inputSearch.value = '';
        loadingSpinner(true);
        loadData();
    }
}

async function loadData() {
    loadingSpinner(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();

    data.data.forEach(element => {
        all.push(element)
        if (element.status === 'open') {
            const isIn = open.find(item => item.id == element.id);
            if (!isIn) {
                open.push(element);
            }

        } else {
            const isIn = close.find(item => item.id == element.id);
            if (!isIn) {
                close.push(element);
            }
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
                                        <img src="${element.status == 'open' ? `./assets/Open-Status.png` : `./assets/Closed- Status .png`}" alt="">
                                    </div>
                                    <p  class="${element.priority == 'low' ? `bg-[#EEEFF2] text-[#9CA3AF] border ` : element.priority == 'medium' ? `bg-[#FFF6D1] text-[#F59E0B] border ` : `bg-[#FEECEC]  text-[#EF4444] border`}  py-1 px-2 rounded-xl text-xs   font-medium">
                                        ${element.priority}</p>
                                </div>
                                <div class="space-y-2">
                                    <h2 class="font-semibold text-[16px] h-12">${element.title}</h2>
                                    <p  class="line-clamp-2 text-[14px] text-gray ">${element.description}</p>
                                </div>
                                <div class="flex gap-2">
                                    ${displayLabels(element.labels)}
                                </div>

                            </div>
                            <div class=" flex justify-between">
                                <p class="text-xs text-gray ">#${element.id} by ${element.author}</p>
                                <p class="text-xs text-gray ">${element.createdAt.slice(0, 10)}</p>
                            </div>
                            <div class=" flex justify-between">
                                <p class="text-xs text-gray ">Assignee : ${element.assignee ? element.assignee : 'Unassigned'}</p>
                                <p class="text-xs text-gray ">Updated : ${element.updatedAt.slice(0, 10)}</p>
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
                                <p   class=" ${data.status === 'open' ? `bg-green-200 text-green-500 border` : `bg-red-100 text-red-500 border `} px-4 py-2 text-xs  rounded-full">${data.status}
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
                            <div class="flex bg-base-200 p-4 rounded-xl">
                                <div class="w-[50%] space-y-2.5">
                                    <p class="text-gray ">
                                        Assignee:  
                                    </p>
                                    <p id="modalNameB" class="font-semibold">
                                    ${data.assignee ? data.assignee : 'Unassigned'}
                                    </p>
                                </div>
                                <div class="space-y-2.5">
                                    <p class="text-gray ">
                                        Priority:
                                    </p>
                                    <p  class="${data.priority == 'low' ? `bg-[#EEEFF2] text-[#9CA3AF] border ` : data.priority == 'medium' ? `bg-[#FFF6D1] text-[#F59E0B] border ` : `bg-[#FEECEC]  text-[#EF4444] border`} px-4 py-1.25 rounded-full ">
                                    ${data.priority}
                                    </p>
                                </div>
                            </div>
                        
    `
    modalDetails.appendChild(newModal)


    boxModal.showModal()
}
loadData();

btnSearch.addEventListener('click', () => {
    allBtn.classList.remove('btn-primary');
    openBtn.classList.remove('btn-primary');
    closeBtn.classList.remove('btn-primary');
    allBtn.classList.add('bg-base-100');
    openBtn.classList.add('bg-base-100');
    closeBtn.classList.add('bg-base-100');
    const searchText = inputSearch.value.trim();
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`).then(res => res.json()).then(json => displayData(json.data))


})