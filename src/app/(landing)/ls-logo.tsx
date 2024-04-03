import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  className?: string;
}

const LsLogo = ({ className }: CheckboxProps) => {
  return (
    <svg
      viewBox="0 0 21 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("h-20 w-20", className)}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.92882 17.1856L14.4401 20.6583C15.3711 21.0889 16.0282 21.8116 16.3831 22.6406C17.2807 24.7399 16.0539 26.8869 14.1281 27.6591C12.2019 28.4309 10.1491 27.9342 9.21568 25.7511L5.94677 18.0866C5.69346 17.4925 6.3298 16.9087 6.92882 17.1856Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.37906 14.9376L15.1327 12.0066C17.7096 11.0325 20.5245 12.8756 20.4865 15.5536C20.4859 15.5886 20.4853 15.6235 20.4844 15.6588C20.4287 18.2666 17.6921 20.0194 15.1718 19.0968L7.3864 16.2473C6.76536 16.0201 6.76077 15.1713 7.37906 14.9376Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.94499 13.9224L14.5671 10.6837C17.0999 9.60736 17.7427 6.37695 15.759 4.51043C15.733 4.48585 15.707 4.46156 15.6807 4.43728C13.7358 2.63207 10.5208 3.26767 9.41358 5.64539L5.99323 12.9915C5.72033 13.5773 6.3371 14.1806 6.94499 13.9224Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.98349 12.6426L7.75465 5.04415C8.09822 4.102 8.03458 3.1412 7.67939 2.3122C6.77994 0.21378 4.34409 -0.463579 2.41853 0.309741C0.493284 1.08336 -0.594621 2.84029 0.340622 5.02253L3.63095 12.6787C3.8861 13.272 4.76261 13.2486 4.98349 12.6426Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LsLogo;
