document.addEventListener("DOMContentLoaded", function () {
    const fixedCheckboxes = document.querySelectorAll(".fixed-service-checkbox");
    const dropdowns = document.querySelectorAll(".service-dropdown");
    const totalText = document.getElementById("floating-total-text");
    const suggestionText = document.getElementById("floating-suggestion-text");

    const plans = {
        "Básico": { price: 5600000, services: ["Auditoría y Optimización SEO", "Configuración y ejecución de campañas Paid Media (Google Ads, Meta Ads)", "Estrategia de marketing de contenido", "Rediseño UX/UI de una landing page", "Configuración inicial de herramientas de automatización (Make.com, HubSpot, etc.)", "Campañas Digitales"] },
        "Intermedio": { price: 19800000, services: ["Benchmarking competitivo y recomendaciones", "Reuniones Estratégicas", "Soporte", "Capacitación y Guía Técnica", "Automatización", "Reportería"] },
        "Premium": { price: 34200000, services: ["Facilitación Ágil", "Gestión de impedimentos", "Coaching de equipos", "Implementación de metodologías ágiles", "Gestión del Backlog", "Definición de roadmap", "Priorización de funcionalidades", "Coordinación con stakeholders"] }
    };

    function calculateTotal() {
        let total = 0;
        let selectedServices = [];

        fixedCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.dataset.price, 10);
                selectedServices.push(checkbox.parentElement.previousElementSibling.textContent.trim());
            }
        });

        dropdowns.forEach(dropdown => {
            let selectedOption = dropdown.options[dropdown.selectedIndex];
            let price = parseInt(selectedOption.value, 10);
            if (price > 0) {
                total += price;
                selectedServices.push(dropdown.parentElement.previousElementSibling.textContent.trim());
            }
        });

        totalText.textContent = `Total: $${total.toLocaleString()} CLP`;

        let bestPlan = null;
        let extraServices = [];

        for (let [planName, plan] of Object.entries(plans)) {
            let matchedServices = selectedServices.filter(service => plan.services.includes(service)).length;
            let coverage = matchedServices / selectedServices.length;

            if (coverage >= 0.7) {
                bestPlan = planName;
                extraServices = selectedServices.filter(service => !plan.services.includes(service));
                break;
            }
        }

        if (bestPlan) {
            let planPrice = plans[bestPlan].price;
            let extraCost = selectedServices.reduce((sum, service) => {
                if (!plans[bestPlan].services.includes(service)) {
                    let price = fixedCheckboxes.find(cb => cb.parentElement.previousElementSibling.textContent.trim() === service)?.dataset.price || 0;
                    return sum + parseInt(price, 10);
                }
                return sum;
            }, 0);

            let adjustedPrice = planPrice + extraCost;
            let extraText = extraServices.length > 0 ? ` con los siguientes extras: ${extraServices.map(s => `+ ${s}`).join(", ")}` : "";

            suggestionText.innerHTML = `Te recomendamos el **${bestPlan}** ($${planPrice.toLocaleString()})${extraText}. **Costo total ajustado: $${adjustedPrice.toLocaleString()}**`;
        } else {
            suggestionText.innerHTML = "Te recomendamos un plan personalizado basado en tu selección.";
        }
    }

    fixedCheckboxes.forEach(checkbox => checkbox.addEventListener("change", calculateTotal));
    dropdowns.forEach(dropdown => dropdown.addEventListener("change", calculateTotal));

    calculateTotal();
});