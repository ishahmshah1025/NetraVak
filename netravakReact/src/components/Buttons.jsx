const variantStyles = {
    "primary": "bg-jet text-cyan tracking-wider ",
    "secondary": "bg-charcoal-light text-charcoal-dark",
    "textonly": "bg-cyan text-blue-700 "
};

const buttonSize = {
    "sm": "px-2 py-1 text-sm rounded-sm",
    "md": "px-4 py-1 text-md rounded-md",
    "lg": "px-6 py-2 text-lg rounded-lg",
    "xl": "px-8 py-3 text-xl rounded-xl"
};

export const Button = ({ onClick, text, size, variant, disable }) => {
    return (
        <button 
            onClick={onClick} 
            className={`${variantStyles[variant]} ${buttonSize[size]} flex justify-center font-opensans hover:cursor-pointer`} 
            disabled={disable}
        >
            {text}
        </button>
    );
};
