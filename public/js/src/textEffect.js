var SVG_NS = "http://www.w3.org/2000/svg";
var TextEffect = {
    glow: function(textSvg, opt){
        [].forEach.call(textSvg.parentNode.querySelectorAll('.filter_glow_text,.filter_glow_defs'), function(f){
            f.remove();
        });
        if(Object.keys(opt).length === 0)return;
        var color = opt.color || "#000",
            opacity = opt.opacity || "1",
            stdDeviation = opt.size || "4",
            filterText = textSvg.cloneNode(true),
            //filterText = React.cloneElement(textSvg),
            id = Math.random().toFixed(10).slice(-10),
            defs = document.createElementNS(SVG_NS, "defs");
        defs.setAttribute("id", `defs_glow_${id}`);
        defs.setAttribute("class", "filter_glow_defs");
        defs.innerHTML = this.getGlowFilter(`filter_glow_${id}`, stdDeviation);
        filterText.removeAttribute("data-reactid");
        filterText.setAttribute("filter", `url(#filter_glow_${id})`);
        filterText.setAttribute("fill", color);
        filterText.setAttribute("opacity", opacity);
        filterText.setAttribute("class", "filter_glow_text");
        textSvg.parentNode.insertBefore(defs, textSvg);
        textSvg.parentNode.insertBefore(filterText, textSvg);
    },
    getGlowFilter: function(id, stdDeviation){
        return `
            <filter id="${id}" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="${stdDeviation}" result="glow"/>
                <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="glow"/>
                </feMerge>
            </filter>`;
    },
    shadow: function(textSvg, opt){
        [].forEach.call(textSvg.parentNode.querySelectorAll('.filter_shadow_text,.filter_shadow_defs'), function(f){
            f.remove();
        });
        if(Object.keys(opt).length === 0)return;
        var color = opt.color || "#000",
            opacity = opt.opacity || 1,
            stdDeviation = opt.blur || 4,
            distance = opt.distance || 0,
            angle = opt.angle || 0,
            filterText = textSvg.cloneNode(true),
            id = Math.random().toFixed(10).slice(-10),
            defs = document.createElementNS(SVG_NS, "defs");
        defs.setAttribute("id", `defs_shadow_${id}`);
        defs.setAttribute("class", "filter_shadow_defs");
        defs.innerHTML = this.getShadowFilter(`filter_shadow_${id}`, stdDeviation, distance);
        filterText.setAttribute("filter", `url(#filter_shadow_${id})`);
        filterText.setAttribute("fill", color);
        filterText.setAttribute("opacity", opacity);
        filterText.setAttribute("class", "filter_shadow_text");
        textSvg.parentNode.insertBefore(defs, textSvg);
        textSvg.parentNode.insertBefore(filterText, textSvg);
    },
    getShadowFilter: function(id, stdDeviation, distance){
        return `
            <filter id="${id}" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="${stdDeviation}" result="shadow"/>
                <feOffset dx="${distance}" dy="${distance}"/>
            </filter>`;
    }
}

module.exports = TextEffect;