import { Link } from "react-router";
const LinkButton = (props: {
    color: string;
    text: string;
    txtColor: string;
    link?: string;
    className?: string;
}) => {
    const { color, text, txtColor, link, className } = props;
    return (
        <Link
            to={link ?? "/Account"}
            className={className ?? "inline-flex h-16 w-3/4 items-center justify-center rounded-3xl text-xl"}
            style={{ backgroundColor: color, color: txtColor }}
        >
            {text}
        </Link>
    );
}

export default LinkButton;