// Projects data organized from newest to oldest
const projects = [
  {
    id: "coldcallbot",
    title: "ColdCallBot",
    date: "2025-06-02",
    iconUrl: "https://coldcallbot.com/favicon.ico",
    description: "AI-powered cold calling automation bot",
    url: "https://coldcallbot.com",
    type: "main",
  },
  {
    id: "blogbott",
    title: "BlogBott",
    date: "2025-06-02",
    iconUrl: "https://blogbott.com/favicon.ico",
    description: "AI blog content generation platform",
    url: "https://blogbott.com",
    type: "main",
  },
  {
    id: "wavelandgunclub",
    title: "Waveland Gun Club",
    date: "2025-05-31",
    iconUrl:
      "https://wavelandgunclub.com/assets/imgs/waveland_gun_club_icon.png",
    description: "Professional shooting club website",
    url: "https://wavelandgunclub.com",
    type: "main",
  },
  {
    id: "ubghub",
    title: "UBG Hub",
    date: "2025-05-25",
    iconUrl: "https://ubghub.org/ubghub.png",
    description: "Unblocked games hub platform",
    url: "https://ubghub.org",
    type: "main",
  },
  {
    id: "fullsusmtb",
    title: "Full Sus MTB",
    date: "2025-05-27",
    iconUrl: "https://fullsusmtb.org/mtb_icon.png",
    description: "Mountain biking community and gear reviews",
    url: "https://fullsusmtb.org",
    type: "main",
  },
  {
    id: "alltutors",
    title: "AllTutors",
    date: "2025-05-25",
    iconUrl: "https://alltutors.org/logo.png",
    description: "Platform connecting students with tutors",
    url: "https://alltutors.org",
    type: "main",
  },

  {
    id: "mirrify",
    title: "Mirrify.io",
    date: "2025-05-14",
    iconUrl: "https://mirrify.io/assets/lambda.ico",
    description:
      "Mirrify is a no-nonsense tool that downloads any site you give it.",
    url: "https://mirrify.io",
    type: "featured",
    media: {
      type: "youtube",
      url: "https://www.youtube.com/embed/dceV3ljBcxQ",
      title: "Mirrify.io Demo",
    },
  },
  {
    id: "quackprep",
    title: "QuackPrep",
    date: "2024-07-01",
    iconUrl: "https://quackprep.com/favicon.ico",
    description:
      "Find free past exams & study material filtered by your college",
    url: "https://quackprep.com",
    type: "featured",
    media: {
      type: "video",
      url: "https://quackprep.com/vid/quack.mp4",
    },
  },
  {
    id: "duckmath",
    title: "DuckMath",
    date: "2023-08-01",
    iconUrl: "https://duckmath.org/assets/img/duck.webp",
    description: "An unblocked games site with 6M+ views and 7k ARR",
    url: "https://duckmath.org",
    type: "featured",
    media: {
      type: "image",
      url: "assets/img/duckmath.png",
      alt: "DuckMath Website Preview",
    },
  },
];

// Function to group projects by month
function groupProjectsByMonth(projects) {
  const groups = {};

  projects.forEach((project) => {
    const date = new Date(project.date);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(project);
  });

  return groups;
}

// Function to render projects timeline
function renderProjectsTimeline() {
  const container = document.getElementById("projects-timeline");
  if (!container) return;

  container.innerHTML = "";

  const groupedProjects = groupProjectsByMonth(projects);
  let itemIndex = 0;

  // Process each month group
  Object.keys(groupedProjects).forEach((monthYear) => {
    const monthProjects = groupedProjects[monthYear];

    if (monthProjects.length >= 2) {
      // Bundle projects for this month
      renderBundledProjects(container, monthProjects, itemIndex);
    } else {
      // Render individual projects
      monthProjects.forEach((project) => {
        renderIndividualProject(container, project, itemIndex);
        itemIndex++;
      });
    }
    itemIndex++;
  });
}

// Function to render individual project
function renderIndividualProject(container, project, index) {
  const projectElement = document.createElement("div");
  projectElement.className = `timeline-item ${project.type}`;
  projectElement.style.setProperty("--item-index", index);

  const date = new Date(project.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const mediaHTML = generateMediaHTML(project);

  projectElement.innerHTML = `
    <div class="timeline-marker">
      <div class="timeline-icon">
        <img src="${project.iconUrl}" alt="${
    project.title
  }" class="timeline-icon-img" />
      </div>
    </div>
    <div class="timeline-content">
      <div class="timeline-header">
        <h4>${project.title}</h4>
        <span class="timeline-date">${formattedDate}</span>
      </div>
      <div class="timeline-description">${project.description}</div>
      <div class="timeline-details">
        ${mediaHTML}
        <div style="margin-top: 1rem;">
          <strong>Type:</strong> ${
            project.type === "featured" ? "Featured Project" : "Side Project"
          }<br>
          <strong>Status:</strong> Active<br>
          ${
            project.type === "featured"
              ? "<strong>Details:</strong> Major project with media showcase"
              : ""
          }
        </div>
      </div>
      <a href="${project.url}" target="_blank" rel="noopener noreferrer">
        Visit Site <i class="fas fa-external-link-alt"></i>
      </a>
    </div>
  `;

  container.appendChild(projectElement);
}

// Function to render bundled projects
function renderBundledProjects(container, monthProjects, index) {
  const bundleElement = document.createElement("div");
  bundleElement.className = "timeline-item bundled";
  bundleElement.style.setProperty("--item-index", index);

  const date = new Date(monthProjects[0].date);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Create icons for all projects in the bundle
  const iconsHTML = monthProjects
    .map(
      (project, idx) => `
    <div class="bundle-icon" data-project-id="${project.id}">
      <div class="timeline-icon small">
        <img src="${project.iconUrl}" alt="${
        project.title
      }" class="timeline-icon-img" />
      </div>
      <div class="icon-tooltip">
        <h5>${project.title}</h5>
        <p>${project.description}</p>
        <div class="tooltip-details">
          <strong>Type:</strong> ${
            project.type === "featured" ? "Featured" : "Side Project"
          }<br>
          <a href="${
            project.url
          }" target="_blank" rel="noopener noreferrer">Visit Site <i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  bundleElement.innerHTML = `
    <div class="timeline-marker">
      <div class="bundle-icons">
        ${iconsHTML}
      </div>
    </div>
    <div class="timeline-content bundle-content">
      <div class="timeline-header">
        <h4>${monthProjects.length} Projects</h4>
        <span class="timeline-date">${formattedDate}</span>
      </div>
      <div class="timeline-description">
        Projects: ${monthProjects
          .map((p) => p.title)
          .join(", ")}. Hover over icons for details.
      </div>
    </div>
  `;

  container.appendChild(bundleElement);
}

// Function to generate media HTML
function generateMediaHTML(project) {
  if (!project.media) return "";

  switch (project.media.type) {
    case "youtube":
      return `
        <div class="timeline-media">
          <iframe
            width="100%"
            height="150"
            src="${project.media.url}"
            title="${project.media.title}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
      `;
    case "video":
      return `
        <div class="timeline-media">
          <video
            controls
            width="100%"
            height="150"
            preload="metadata">
            <source src="${project.media.url}" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    case "image":
      return `
        <div class="timeline-media">
          <img src="${project.media.url}" alt="${project.media.alt}" />
        </div>
      `;
    default:
      return "";
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener("DOMContentLoaded", renderProjectsTimeline);
