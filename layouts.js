/*
 * Keyboard layout mappings and physical-finger metadata.
 * IMPORTANT: independently verify every mapping against the official chart
 * required by your examination before using this as an exam source.
 */
const LAYOUTS = {
  mangal: { id:'mangal', label:'Mangal (Inscript)', status:'verify against official chart', unicode:true, recommended:true, blurb:'Unicode Devanagari keyboard layout for practice. Check your exam notification for the required layout.', whenToUse:'Choose only if your exam specifies Unicode/Inscript/Mangal.', keys:{} },
  krutidev: { id:'krutidev', label:'Kruti Dev (legacy)', status:'verify against official chart', unicode:true, recommended:false, blurb:'Legacy Remington-style key practice. Mapping needs official-chart validation.', whenToUse:'Use only when your exam explicitly requires the corresponding Kruti Dev layout.', keys:{} },
  remington: { id:'remington', label:'Remington Gail', status:'coming soon', unicode:true, recommended:false, blurb:'Not available yet because a reliable mapping source has not been validated.', whenToUse:'This layout is not yet available.', keys:{} }
};
function getLayout(id) { return LAYOUTS[id] || null; }
function layoutKeyList(layout) { return Object.keys(layout && layout.keys ? layout.keys : {}); }
