/* --------- Pie (donut) chart using SVG arcs --------- */
(function(){
  // Data should total 100 (or any sum; we normalize)
  const data = [
    {label:'Food', value:40, color:getCSS('--food')},
    {label:'Bills', value:30, color:getCSS('--bills')},
    {label:'Shop', value:30, color:getCSS('--shop')}
  ];

  // Draw as inline SVG to keep it crisp & accessible
  const container = document.getElementById('pie');
  const size = 112;
  const thickness = 22;
  const r = (size/2) - 2;      // radius (outer)
  const ri = r - thickness;    // inner radius

  const svg = el('svg', {viewBox:`0 0 ${size} ${size}`, width:size, height:size, role:'img', 'aria-label':'Spending breakdown'});
  const g = el('g', {transform:`translate(${size/2} ${size/2})`});

  // Normalize and compute arcs
  const total = data.reduce((a,b)=>a+b.value,0) || 1;
  let start = -Math.PI/2; // start at top for nicer look
  data.forEach(d=>{
    const angle = (d.value/total) * Math.PI*2;
    const end = start + angle;
    const path = donutArc(r, ri, start, end);
    const seg = el('path', {d:path, fill:d.color});
    g.appendChild(seg);
    start = end;
  });

  // Knockout hole (for crisp donut)
  // (Since we built it as true arcs with inner radius, no extra hole needed)

  svg.appendChild(g);
  container.innerHTML = '';
  container.appendChild(svg);

  /* --------- Responsive line chart (SVG) --------- */
  const lineEl = document.getElementById('lineChart');
  const months = ['Jan','Feb','Mar','Apr'];
  const values = [12_400, 12_980, 12_650, 13_120];

  function drawLine(){
    const w = lineEl.clientWidth || lineEl.parentElement.clientWidth;
    const h = lineEl.clientHeight || 96;
    lineEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
    lineEl.innerHTML = '';

    const padding = 10;
    const xStep = (w - padding*2) / (months.length - 1);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const yScale = (val) => {
      // invert for SVG (0 is top)
      const t = (val - min) / (max - min || 1);
      return h - padding - t * (h - padding*2);
    };

    // Area under line
    const p = [];
    values.forEach((v,i)=>p.push([padding + i*xStep, yScale(v)]));

    const dLine = smoothPath(p);
    const area = dLine + ` L ${padding + (months.length-1)*xStep} ${h - padding} L ${padding} ${h - padding} Z`;

    const areaEl = el('path', {d:area, fill:withAlpha(getCSS('--food'), .2), stroke:'none'});
    const line = el('path', {d:dLine, fill:'none', stroke:getCSS('--food'), 'stroke-width':2});
    lineEl.appendChild(areaEl);
    lineEl.appendChild(line);
  }

  drawLine();
  window.addEventListener('resize', drawLine);

  /* --------- Helpers --------- */
  function el(tag, attrs){
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs || {}).forEach(([k,v])=>n.setAttribute(k,v));
    return n;
  }
  function donutArc(ro, ri, a0, a1){
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0o = ro * Math.cos(a0), y0o = ro * Math.sin(a0);
    const x1o = ro * Math.cos(a1), y1o = ro * Math.sin(a1);
    const x0i = ri * Math.cos(a1), y0i = ri * Math.sin(a1);
    const x1i = ri * Math.cos(a0), y1i = ri * Math.sin(a0);
    return [
      `M ${x0o} ${y0o}`,
      `A ${ro} ${ro} 0 ${large} 1 ${x1o} ${y1o}`,
      `L ${x0i} ${y0i}`,
      `A ${ri} ${ri} 0 ${large} 0 ${x1i} ${y1i}`,
      'Z'
    ].join(' ');
  }
  function smoothPath(points){
    if(points.length<=2){
      return `M ${points.map(p => p.join(' ')).join(' L ')}`;
    }
    const d = [`M ${points[0][0]} ${points[0][1]}`];
    for(let i=1;i<points.length;i++){
      const [x0,y0] = points[i-1];
      const [x1,y1] = points[i];
      const xm = (x0 + x1) / 2;
      // Quadratic to mid, then to end (simple smoothing)
      d.push(`Q ${x0} ${y0} ${xm} ${ (y0 + y1)/2 }`);
      d.push(`T ${x1} ${y1}`);
    }
    return d.join(' ');
  }
  function getCSS(varName){
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  function withAlpha(hex, a){
    // support rgb/hex
    if(hex.startsWith('rgb')){
      const nums = hex.match(/\d+/g).map(Number);
      return `rgba(${nums[0]},${nums[1]},${nums[2]},${a})`;
    }
    // #rrggbb
    const h = hex.replace('#','');
    const r = parseInt(h.slice(0,2),16);
    const g = parseInt(h.slice(2,4),16);
    const b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }
})();

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  // Remove after 5s (match fadeOut timing)
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Attach event listeners to actions
document.querySelectorAll(".action").forEach((btn) => {
  btn.addEventListener("click", () => {
    let msg = "Action performed!";
    if (btn.textContent.includes("Transfer")) msg = "This account is currently flagged and has not been activated. To enable access to this feature, please contact our Customer Support team for assistance";
    if (btn.textContent.includes("Pay Bills")) msg = "This account is currently flagged and has not been activated. To enable access to this feature, please contact our Customer Support team for assistance.";
    if (btn.textContent.includes("Deposit")) msg = "This account is currently flagged and has not been activated. To enable access to this feature, please contact our Customer Support team for assistance.";
    if (btn.textContent.includes("Manage Investments")) msg = "Not ready yet!";

    showToast(msg);
  });
});

document.querySelectorAll(".dis").forEach((btn) => {
  btn.addEventListener("click", () => {
    let msg = "This account is currently flagged and has not been activated. To enable access to this feature, please contact our Customer Support team for assistance.";
    showToast(msg);
  });
});

