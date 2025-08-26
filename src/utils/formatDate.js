export function formatDate(date) {
return date.toLocaleDateString("es-SV", {
weekday: "long", year: "numeric", month: "long", day: "numeric",
});
}