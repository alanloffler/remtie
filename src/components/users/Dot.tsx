// Dot type
type Dot = {
    width: string;
    className: string;
    radius: string;
    margin: string;
};
// React component
function Dot(props: Dot) {
    const dot = {
        width: props.width,
        height: props.width,
        borderRadius: props.radius,
        display: "flex",
        margin: props.margin
    };
    return <div className={props.className} style={dot}></div>;
}
// Export React component
export default Dot;
