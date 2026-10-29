import { createCn } from "cn/config"

// `cn` necesita conocer los tokens propios del design system (src/index.css). Sin esto,
// clases como `text-body-md` se toman por colores y eliminan `text-on-primary` al fusionar.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-ticket",
            "display-ticket-mobile",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "body-lg",
            "body-md",
            "body-sm",
            "label-telemetry",
            "data-mono",
          ],
        },
      ],
      shadow: [{ shadow: ["panel", "focus", "header"] }],
    },
  },
})
