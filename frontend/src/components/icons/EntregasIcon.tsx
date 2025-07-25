interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

const EntregasIcon = ({ size = 24, className, ...props }: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="fill-white" viewBox="0 0 418.97 287.58" width={size} height={size} className={className} {...props}>
            <g className="fill-white" id="entregas" data-name="entregas">
                <g>
                    <path d="M237.05,0H32.42C14.51,0,0,14.51,0,32.42v179.3c0,17.9,14.51,32.42,32.42,32.42h19.19c0-30.21,24.49-54.71,54.71-54.71s54.71,24.49,54.71,54.71h108.45V32.42c0-17.9-14.51-32.42-32.42-32.42Z" />
                    <path d="M106.31,200.69c-23.99,0-43.44,19.45-43.44,43.44s19.45,43.44,43.44,43.44,43.44-19.45,43.44-43.44-19.45-43.44-43.44-43.44ZM106.31,263.41c-10.63,0-19.27-8.64-19.27-19.27s8.64-19.27,19.27-19.27,19.27,8.64,19.27,19.27-8.64,19.27-19.27,19.27Z" />
                    <path d="M412.54,143.77l-37.75-60.18c-7.69-12.26-21.14-19.7-35.61-19.7h-58.8v156.17c8.91-18.14,27.56-30.63,49.13-30.63,30.21,0,54.71,24.49,54.71,54.71h18.82c8.8,0,15.94-7.14,15.94-15.94v-62.09c0-7.9-2.23-15.65-6.43-22.34ZM304.55,132.47v-44.41h34.63c6.19,0,11.85,3.13,15.13,8.37l22.61,36.03h-72.36Z" />
                    <path d="M329.5,200.69c-23.99,0-43.44,19.45-43.44,43.44s19.45,43.44,43.44,43.44,43.44-19.45,43.44-43.44-19.45-43.44-43.44-43.44ZM329.5,263.41c-10.63,0-19.27-8.64-19.27-19.27s8.64-19.27,19.27-19.27,19.27,8.64,19.27,19.27-8.64,19.27-19.27,19.27Z" />
                </g>
            </g>
        </svg>
    )
}

export default EntregasIcon;
