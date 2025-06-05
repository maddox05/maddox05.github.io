console.log("All work and no play makes Maddox a dull boy.");

// Ad Banner Injection System
class AdBannerInjector {
  constructor() {
    this.bannerData = [
      {
        title: "🚀 BlogBott",
        memo: "Automate SEO & Drive Traffic to your Site with BlogBott",
        link: "https://blogbott.com",
      },
    ];
    this.bannerId = "injected-ad-banner";
  }

  getRandomBannerData() {
    const randomIndex = Math.floor(Math.random() * this.bannerData.length);
    return this.bannerData[randomIndex];
  }

  createBannerStyles() {
    const style = document.createElement("style");
    style.textContent = `
            #${this.bannerId} {
                position: static;
                width: 100%;
                background: black;
                color: white;
                padding: 12px 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
                display: block;
                box-sizing: border-box;
                margin: 0;
            }

            #${this.bannerId} .banner-content {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }

            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            #${this.bannerId} .banner-content {
                display: flex;
                align-items: center;
                flex: 1;
            }

            #${this.bannerId} .banner-title {
                font-weight: bold;
                font-size: 16px;
                margin-right: 15px;
                text-decoration: none;
                color: #1a73e8;
                transition: all 0.3s ease;
                background: white;
                color: black;
                padding: 8px 16px;
                border-radius: 50px;
                display: inline-block;
            }

            #${this.bannerId} .banner-title:hover {
                background: #f0f0f0;
                color: black;
                text-decoration: none;
                transform: scale(1.05);
            }

            #${this.bannerId} .banner-memo {
                font-size: 14px;
                opacity: 0.9;
            }

            #${this.bannerId} .close-button {
                background: #333;
                border: 1px solid #555;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                flex-shrink: 0;
                margin-left: 20px;
            }

            #${this.bannerId} .close-button:hover {
                background: #555;
                color: white;
                border-color: #777;
                transform: scale(1.1);
            }

            .banner-body-offset {
                margin-top: 60px !important;
                transition: margin-top 0.5s ease-out;
            }

            @media (max-width: 768px) {
                #${this.bannerId} {
                    padding: 10px 15px;
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                #${this.bannerId} .banner-content {
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                }
                
                #${this.bannerId} .banner-title {
                    margin-right: 0;
                    margin-bottom: 5px;
                }
                
                #${this.bannerId} .close-button {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    margin-left: 0;
                }
                
                .banner-body-offset {
                    margin-top: 80px !important;
                }
            }
        `;
    document.head.appendChild(style);
  }

  createBanner() {
    // Check if banner already exists
    if (document.getElementById(this.bannerId)) {
      return;
    }

    const bannerData = this.getRandomBannerData();

    const banner = document.createElement("div");
    banner.id = this.bannerId;

    banner.innerHTML = `
            <div class="banner-content">
                <a href="${bannerData.link}" class="banner-title" target="_blank" rel="noopener noreferrer">
                    ${bannerData.title}
                </a>
                <div class="banner-memo">${bannerData.memo}</div>
            </div>
            <!-- <button class="close-button" onclick="this.parentElement.remove(); document.body.classList.remove('banner-body-offset');">
                ×
            </button> -->
        `;

    document.body.insertBefore(banner, document.body.firstChild);
  }

  inject() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.createBannerStyles();
        this.createBanner();
      });
    } else {
      this.createBannerStyles();
      this.createBanner();
    }
  }
}

// Auto-inject the banner when script loads
const adBanner = new AdBannerInjector();
adBanner.inject();

// Expose globally for manual control if needed
window.AdBannerInjector = AdBannerInjector;
