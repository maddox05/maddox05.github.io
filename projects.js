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
    metrics: {},
  },
  {
    id: "blogbott",
    title: "BlogBott",
    date: "2025-06-02",
    iconUrl: "https://blogbott.com/favicon.ico",
    description: "AI blog content generation platform",
    url: "https://blogbott.com",
    type: "main",
    metrics: {},
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
    metrics: {},
  },
  {
    id: "commonground",
    title: "CommonGround",
    date: "2025-01-21",
    iconUrl: "https://commonground.click/favicon.ico",
    description:
      "A social experiment to help divided republicans and democrats find common ground on complex topics via short, live-chat discussions.",
    url: "https://commonground.click",
    type: "main",
    metrics: { users: "None Yet" },
  },
  {
    id: "ubghub",
    title: "UBG Hub",
    date: "2025-05-25",
    iconUrl: "https://ubghub.org/ubghub.png",
    description: "Unblocked games hub platform",
    url: "https://ubghub.org",
    type: "main",
    metrics: {},
  },
  {
    id: "fullsusmtb",
    title: "Full Sus MTB",
    date: "2025-05-27",
    iconUrl: "https://fullsusmtb.org/mtb_icon.png",
    description: "Mountain biking community and gear reviews",
    url: "https://fullsusmtb.org",
    type: "main",
    metrics: {},
  },
  {
    id: "alltutors",
    title: "AllTutors",
    date: "2025-05-25",
    iconUrl: "https://alltutors.org/logo.png",
    description: "Platform connecting students with tutors",
    url: "https://alltutors.org",
    type: "main",
    metrics: {},
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
    metrics: {},
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
    metrics: {
      users: "200+ College students",

      revenue: "$20 (hah) ",
    },
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
    metrics: {
      users: "6M+ views",

      revenue: "$7k ARR",
    },
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
          <strong>Users:</strong> ${project.metrics?.users || "None Yet"}<br>
          ${
            project.metrics?.revenue
              ? `<strong>Revenue:</strong> ${project.metrics.revenue}<br>`
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
          <strong>Users:</strong> ${project.metrics?.users || "None Yet"}<br>
          ${
            project.metrics?.revenue
              ? `<strong>Revenue:</strong> ${project.metrics.revenue}<br>`
              : ""
          }
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

// Scroll animation functionality
function initScrollAnimations() {
  // Animate timeline line as user scrolls
  function updateTimelineLine() {
    const timeline = document.querySelector(".timeline-container");
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const timelineHeight = timeline.offsetHeight;

    // Calculate how much of the timeline is visible
    const visibleStart = Math.max(0, -rect.top);
    const visibleEnd = Math.min(timelineHeight, windowHeight - rect.top);
    const visibleHeight = Math.max(0, visibleEnd - visibleStart);

    // Calculate percentage of timeline that should be filled
    const percentage = Math.min(100, (visibleHeight / timelineHeight) * 100);

    // Update the timeline line height
    timeline.style.setProperty("--timeline-progress", `${percentage}%`);
    document.documentElement.style.setProperty(
      "--timeline-progress",
      `${percentage}%`
    );
  }

  // Intersection Observer for timeline items
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for multiple items entering at once
        setTimeout(() => {
          entry.target.classList.add("animate-in");
        }, index * 150);
      }
    });
  }, observerOptions);

  // Observe all timeline items
  const timelineItems = document.querySelectorAll(".timeline-item");
  timelineItems.forEach((item) => {
    observer.observe(item);
  });

  // Update timeline line on scroll
  window.addEventListener("scroll", updateTimelineLine);
  updateTimelineLine(); // Initial call
}

// Initialize timeline when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderProjectsTimeline();
  // Wait a bit for DOM to be fully ready, then init animations
  setTimeout(initScrollAnimations, 100);
});
