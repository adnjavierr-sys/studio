
export type Theme = {
  name: string;
  label: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  cssVars: {
    '--primary': string;
    '--primary-foreground': string;
    '--accent': string;
    '--accent-foreground': string;
    '--background': string;
    '--foreground': string;
    '--sidebar-primary': string;
    '--sidebar-primary-foreground': string;
    '--sidebar-accent': string;
    '--sidebar-accent-foreground': string;
    '--chart-1': string;
    '--chart-2': string;
  };
};

export const themes: Theme[] = [
  {
    name: "default",
    label: "Cielo Azul",
    colors: {
      primary: 'hsl(190 48% 68%)',
      accent: 'hsl(184 36% 46%)',
      background: 'hsl(200 60% 95%)',
    },
    cssVars: {
      '--primary': '190 48% 68%',
      '--primary-foreground': '190 50% 15%',
      '--accent': '184 36% 46%',
      '--accent-foreground': '0 0% 100%',
      '--background': '200 60% 95%',
      '--foreground': '210 10% 23%',
      '--sidebar-primary': '190 48% 68%',
      '--sidebar-primary-foreground': '190 50% 15%',
      '--sidebar-accent': '200 50% 90%',
      '--sidebar-accent-foreground': '210 10% 23%',
      '--chart-1': '190 48% 68%',
      '--chart-2': '184 36% 46%',
    },
  },
  {
    name: "green",
    label: "Verde Menta",
    colors: {
      primary: 'hsl(150, 50%, 60%)',
      accent: 'hsl(160, 40%, 40%)',
      background: 'hsl(150, 20%, 96%)',
    },
    cssVars: {
      '--primary': '150 50% 60%',
      '--primary-foreground': '150 60% 10%',
      '--accent': '160 40% 40%',
      '--accent-foreground': '0 0% 100%',
      '--background': '150 20% 96%',
      '--foreground': '150 10% 20%',
      '--sidebar-primary': '150 50% 60%',
      '--sidebar-primary-foreground': '150 60% 10%',
      '--sidebar-accent': '150 20% 92%',
      '--sidebar-accent-foreground': '150 10% 20%',
      '--chart-1': '150 50% 60%',
      '--chart-2': '160 40% 40%',
    },
  },
  {
    name: "orange",
    label: "Naranja Cálido",
    colors: {
      primary: 'hsl(25, 80%, 65%)',
      accent: 'hsl(15, 70%, 55%)',
      background: 'hsl(30, 70%, 97%)',
    },
    cssVars: {
      '--primary': '25 80% 65%',
      '--primary-foreground': '25 80% 10%',
      '--accent': '15 70% 55%',
      '--accent-foreground': '0 0% 100%',
      '--background': '30 70% 97%',
      '--foreground': '20 15% 25%',
      '--sidebar-primary': '25 80% 65%',
      '--sidebar-primary-foreground': '25 80% 10%',
      '--sidebar-accent': '30 50% 93%',
      '--sidebar-accent-foreground': '20 15% 25%',
      '--chart-1': '25 80% 65%',
      '--chart-2': '15 70% 55%',
    },
  },
  {
    name: "purple",
    label: "Lavanda Relajante",
    colors: {
      primary: 'hsl(250, 60%, 70%)',
      accent: 'hsl(240, 50%, 50%)',
      background: 'hsl(250, 30%, 97%)',
    },
    cssVars: {
      '--primary': '250 60% 70%',
      '--primary-foreground': '250 50% 15%',
      '--accent': '240 50% 50%',
      '--accent-foreground': '0 0% 100%',
      '--background': '250 30% 97%',
      '--foreground': '240 10% 20%',
      '--sidebar-primary': '250 60% 70%',
      '--sidebar-primary-foreground': '250 50% 15%',
      '--sidebar-accent': '250 30% 92%',
      '--sidebar-accent-foreground': '240 10% 20%',
      '--chart-1': '250 60% 70%',
      '--chart-2': '240 50% 50%',
    },
  },
];
