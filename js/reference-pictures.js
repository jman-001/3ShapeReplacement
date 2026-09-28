/* Builds the scanner reference gallery from data/reference-pictures.json. */

const referenceState = {
    models: [],
    pictures: [],
    visiblePictures: [],
    activeModelId: "all",
    currentIndex: 0
};

const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const search = document.getElementById("searchInput");
const empty = document.getElementById("empty");
const lightbox = document.getElementById("lightbox");

function createReferenceElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function renderReferenceFilters() {
    const filterItems = [
        { id: "all", name: "ALL" },
        ...referenceState.models
    ];

    filters.replaceChildren(
        ...filterItems.map((model) => {
            const button = createReferenceElement(
                "button",
                `filter${
                    model.id === referenceState.activeModelId ? " active" : ""
                }`,
                model.name
            );

            button.type = "button";
            button.dataset.modelId = model.id;
            button.setAttribute(
                "aria-pressed",
                String(model.id === referenceState.activeModelId)
            );

            return button;
        })
    );
}

function createReferenceCard(picture, index) {
    const card = createReferenceElement("article", "card");
    const imageWrap = createReferenceElement("div", "image-wrap");
    const image = document.createElement("img");

    card.tabIndex = 0;
    card.dataset.index = String(index);

    image.src = picture.image;
    image.alt = `${picture.title}, ${picture.modelName}`;
    image.loading = "lazy";
    imageWrap.appendChild(image);

    card.append(
        imageWrap,
        createReferenceElement("h2", "", picture.title),
        createReferenceElement("div", "meta", picture.modelName),
        createReferenceElement("p", "description", picture.description)
    );

    return card;
}

function renderReferenceGallery() {
    const query = search.value.trim().toLowerCase();

    referenceState.visiblePictures = referenceState.pictures.filter(
        (picture) => {
            const matchesModel =
                referenceState.activeModelId === "all" ||
                picture.modelId === referenceState.activeModelId;
            const searchableText = [
                picture.modelName,
                picture.title,
                picture.description
            ]
                .join(" ")
                .toLowerCase();

            return matchesModel && searchableText.includes(query);
        }
    );

    gallery.replaceChildren(
        ...referenceState.visiblePictures.map(createReferenceCard)
    );
    empty.textContent = "No reference pictures match your search.";
    empty.hidden = referenceState.visiblePictures.length > 0;
}

function openReferencePicture(index) {
    const picture = referenceState.visiblePictures[index];

    if (!picture) {
        return;
    }

    referenceState.currentIndex = index;
    document.getElementById("lightboxImage").src = picture.image;
    document.getElementById("lightboxImage").alt =
        `${picture.title}, ${picture.modelName}`;
    document.getElementById("lightboxModel").textContent = picture.modelName;
    document.getElementById("lightboxTitle").textContent = picture.title;
    document.getElementById("lightboxDescription").textContent =
        picture.description;

    if (!lightbox.open) {
        lightbox.showModal();
    }
}

function showAdjacentReferencePicture(offset) {
    const count = referenceState.visiblePictures.length;

    if (!count) {
        return;
    }

    openReferencePicture(
        (referenceState.currentIndex + offset + count) % count
    );
}

function setupReferenceEvents() {
    filters.addEventListener("click", (event) => {
        const button = event.target.closest(".filter");

        if (!button) {
            return;
        }

        referenceState.activeModelId = button.dataset.modelId;
        renderReferenceFilters();
        renderReferenceGallery();
    });

    search.addEventListener("input", renderReferenceGallery);

    gallery.addEventListener("click", (event) => {
        const card = event.target.closest(".card");

        if (card) {
            openReferencePicture(Number(card.dataset.index));
        }
    });

    gallery.addEventListener("keydown", (event) => {
        const card = event.target.closest(".card");

        if (card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openReferencePicture(Number(card.dataset.index));
        }
    });

    document.getElementById("closeLightbox").addEventListener(
        "click",
        () => lightbox.close()
    );
    document.getElementById("prevPicture").addEventListener(
        "click",
        () => showAdjacentReferencePicture(-1)
    );
    document.getElementById("nextPicture").addEventListener(
        "click",
        () => showAdjacentReferencePicture(1)
    );

    document.addEventListener("keydown", (event) => {
        if (!lightbox.open) {
            return;
        }

        if (event.key === "ArrowLeft") {
            showAdjacentReferencePicture(-1);
        } else if (event.key === "ArrowRight") {
            showAdjacentReferencePicture(1);
        }
    });

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            lightbox.close();
        }
    });
}

async function initializeReferencePictures() {
    const page = document.querySelector(".reference-page");

    setupReferenceEvents();
    empty.textContent = "Loading reference pictures…";
    empty.hidden = false;

    if (window.location.protocol === "file:") {
        page.setAttribute("aria-busy", "false");
        empty.textContent =
            "Reference data cannot be loaded from file://. Start the local server with ./serve.ps1 and open http://localhost:8000/pages/reference-pictures.html.";
        return;
    }

    try {
        const response = await fetch(page.dataset.source);

        if (!response.ok) {
            throw new Error(
                `Unable to load reference pictures (${response.status}).`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data.models)) {
            throw new Error("Reference data does not contain a models list.");
        }

        referenceState.models = data.models.map((model) => ({
            id: model.id,
            name: model.name
        }));
        referenceState.pictures = data.models.flatMap((model) =>
            (model.pictures || []).map((picture) => ({
                ...picture,
                modelId: model.id,
                modelName: model.name,
                image: new URL(picture.image, response.url).href
            }))
        );

        renderReferenceFilters();
        renderReferenceGallery();
    } catch (error) {
        console.error(error);
        filters.replaceChildren();
        gallery.replaceChildren();
        empty.textContent =
            "Reference pictures could not be loaded. Please refresh the page or contact support.";
        empty.hidden = false;
    } finally {
        page.setAttribute("aria-busy", "false");
    }
}

document.addEventListener("DOMContentLoaded", initializeReferencePictures);
