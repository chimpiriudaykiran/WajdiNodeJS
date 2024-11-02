//----------------------------------------------------------------
function addRelatedContent(object) {
  let relatedPublicationsHTML = "";

  // Helper function to generate HTML for related items
  function generateRelatedSection(title, items, urlPrefix) {
    if (items && items.length > 0) {
      relatedPublicationsHTML += `
          <div class="project-related-pages content-widget-hr">
            <h2>${title}</h2>
            <div class="media stream-item view-compact">
              <div class="publications">
                <ul>
        `;

      items.forEach((details) => {
        if (details) {
          relatedPublicationsHTML += `
              <li>
                <a href="${urlPrefix}${details.id}">
                  ${details.title}
                </a>
              </li>
            `;
        }
      });

      relatedPublicationsHTML += `
                </ul>
              </div>
            </div>
          </div>
        `;
    }
  }

  // Generate sections for publications, talks, tools, and projects
  generateRelatedSection(
    "Related Publications",
    object.related.papers,
    "/publication/publication.html?id="
  );
  generateRelatedSection(
    "Related Talks",
    object.related.talks,
    "/talks/talk.html?id="
  );
  generateRelatedSection(
    "Related Tools",
    object.related.tools,
    "/tools/tool.html?id="
  );

  // Projects require a slightly different URL structure
  if (object.related.projects && object.related.projects.length > 0) {
    relatedPublicationsHTML += `
        <div class="project-related-pages content-widget-hr">
          <h2>Related Projects</h2>
          <div class="media stream-item view-compact">
            <div class="publications">
              <ul>
      `;

    object.related.projects.forEach((details) => {
      if (details) {
        relatedPublicationsHTML += `
            <li>
              <a href="${details.url}">
                ${details.title}
              </a>
            </li>
          `;
      }
    });

    relatedPublicationsHTML += `
              </ul>
            </div>
          </div>
        </div>
      `;
  }

  // Append the generated HTML to the last article container
  const articleContainers = document.querySelectorAll(".article-container");
  const lastArticleContainer = articleContainers[articleContainers.length - 1];

  if (lastArticleContainer) {
    lastArticleContainer.insertAdjacentHTML(
      "beforeend",
      relatedPublicationsHTML
    );
  }
}
