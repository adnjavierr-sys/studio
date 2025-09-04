
export type Theme = {
  name: string;
  label: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
  };
  cssVars: {
    light: { [key: string]: string };
    dark: { [key: string]: string };
  };
};

export const themes: Theme[] = [
  {
    name: "default",
    label: "Océano Nocturno",
    colors: {
      primary: 'hsl(210, 80%, 60%)',
      accent: 'hsl(190, 70%, 50%)',
      background: 'hsl(220, 15%, 95%)',
    },
    cssVars: {
      light: {
        '--background': '220 20% 97%',
        '--foreground': '220 10% 25%',
        '--card': '0 0% 100%',
        '--card-foreground': '220 10% 25%',
        '--popover': '0 0% 100%',
        '--popover-foreground': '220 10% 25%',
        '--primary': '210 80% 60%',
        '--primary-foreground': '210 80% 10%',
        '--secondary': '220 10% 90%',
        '--secondary-foreground': '220 10% 25%',
        '--muted': '220 10% 90%',
        '--muted-foreground': '220 10% 45%',
        '--accent': '190 70% 50%',
        '--accent-foreground': '0 0% 100%',
        '--destructive': '0 84.2% 60.2%',
        '--destructive-foreground': '0 0% 98%',
        '--border': '220 10% 88%',
        '--input': '220 10% 92%',
        '--ring': '210 80% 60%',
        '--chart-1': '210 80% 60%',
        '--chart-2': '190 70% 50%',
        '--sidebar-background': '0 0% 100%',
        '--sidebar-foreground': '220 10% 25%',
        '--sidebar-primary': '210 80% 60%',
        '--sidebar-primary-foreground': '210 80% 10%',
        '--sidebar-accent': '220 10% 90%',
        '--sidebar-accent-foreground': '220 10% 25%',
        '--sidebar-border': '220 10% 88%',
        '--sidebar-ring': '210 80% 60%',
      },
      dark: {
        '--background': '220 15% 10%',
        '--foreground': '220 10% 85%',
        '--card': '220 15% 12%',
        '--card-foreground': '220 10% 85%',
        '--popover': '220 15% 12%',
        '--popover-foreground': '220 10% 85%',
        '--primary': '210 80% 60%',
        '--primary-foreground': '210 80% 10%',
        '--secondary': '220 10% 20%',
        '--secondary-foreground': '220 10% 85%',
        '--muted': '220 10% 20%',
        '--muted-foreground': '220 10% 65%',
        '--accent': '190 70% 50%',
        '--accent-foreground': '0 0% 100%',
        '--destructive': '0 62.8% 30.6%',
        '--destructive-foreground': '0 0% 98%',
        '--border': '220 10% 25%',
        '--input': '220 10% 25%',
        '--ring': '210 80% 60%',
        '--chart-1': '210 80% 60%',
        '--chart-2': '190 70% 50%',
        '--sidebar-background': '220 15% 12%',
        '--sidebar-foreground': '220 10% 85%',
        '--sidebar-primary': '210 80% 60%',
        '--sidebar-primary-foreground': '210 80% 10%',
        '--sidebar-accent': '220 10% 20%',
        '--sidebar-accent-foreground': '220 10% 85%',
        '--sidebar-border': '220 10% 25%',
        '--sidebar-ring': '210 80% 60%',
      }
    },
  },
  {
    name: "slate",
    label: "Pizarra Corporativa",
    colors: {
      primary: 'hsl(260, 50%, 65%)',
      accent: 'hsl(340, 70%, 60%)',
      background: 'hsl(240, 5%, 96%)',
    },
    cssVars: {
      light: {
        '--background': '240 5% 96%', '--foreground': '240 5% 26%', '--card': '240 5% 100%', '--card-foreground': '240 5% 26%', '--popover': '240 5% 100%', '--popover-foreground': '240 5% 26%', '--primary': '260 50% 65%', '--primary-foreground': '260 50% 10%', '--secondary': '240 5% 90%', '--secondary-foreground': '240 5% 26%', '--muted': '240 5% 90%', '--muted-foreground': '240 5% 46%', '--accent': '340 70% 60%', '--accent-foreground': '0 0% 100%', '--destructive': '0 84.2% 60.2%', '--destructive-foreground': '0 0% 98%', '--border': '240 5% 88%', '--input': '240 5% 92%', '--ring': '260 50% 65%', '--chart-1': '260 50% 65%', '--chart-2': '340 70% 60%', '--sidebar-background': '240 5% 100%', '--sidebar-foreground': '240 5% 26%', '--sidebar-primary': '260 50% 65%', '--sidebar-primary-foreground': '260 50% 10%', '--sidebar-accent': '240 5% 90%', '--sidebar-accent-foreground': '240 5% 26%', '--sidebar-border': '240 5% 88%', '--sidebar-ring': '260 50% 65%'
      },
      dark: {
        '--background': '240 5% 10%', '--foreground': '240 5% 86%', '--card': '240 5% 12%', '--card-foreground': '240 5% 86%', '--popover': '240 5% 12%', '--popover-foreground': '240 5% 86%', '--primary': '260 50% 65%', '--primary-foreground': '260 50% 10%', '--secondary': '240 5% 20%', '--secondary-foreground': '240 5% 86%', '--muted': '240 5% 20%', '--muted-foreground': '240 5% 66%', '--accent': '340 70% 60%', '--accent-foreground': '0 0% 100%', '--destructive': '0 62.8% 30.6%', '--destructive-foreground': '0 0% 98%', '--border': '240 5% 25%', '--input': '240 5% 25%', '--ring': '260 50% 65%', '--chart-1': '260 50% 65%', '--chart-2': '340 70% 60%', '--sidebar-background': '240 5% 12%', '--sidebar-foreground': '240 5% 86%', '--sidebar-primary': '260 50% 65%', '--sidebar-primary-foreground': '260 50% 10%', '--sidebar-accent': '240 5% 20%', '--sidebar-accent-foreground': '240 5% 86%', '--sidebar-border': '240 5% 25%', '--sidebar-ring': '260 50% 65%'
      }
    }
  },
  {
    name: "forest",
    label: "Bosque Profundo",
    colors: {
      primary: 'hsl(140, 40%, 55%)',
      accent: 'hsl(100, 30%, 50%)',
      background: 'hsl(120, 5%, 96%)',
    },
    cssVars: {
      light: {
        '--background': '120 5% 96%', '--foreground': '120 5% 26%', '--card': '120 5% 100%', '--card-foreground': '120 5% 26%', '--popover': '120 5% 100%', '--popover-foreground': '120 5% 26%', '--primary': '140 40% 55%', '--primary-foreground': '140 40% 10%', '--secondary': '120 5% 90%', '--secondary-foreground': '120 5% 26%', '--muted': '120 5% 90%', '--muted-foreground': '120 5% 46%', '--accent': '100 30% 50%', '--accent-foreground': '0 0% 100%', '--destructive': '0 84.2% 60.2%', '--destructive-foreground': '0 0% 98%', '--border': '120 5% 88%', '--input': '120 5% 92%', '--ring': '140 40% 55%', '--chart-1': '140 40% 55%', '--chart-2': '100 30% 50%', '--sidebar-background': '120 5% 100%', '--sidebar-foreground': '120 5% 26%', '--sidebar-primary': '140 40% 55%', '--sidebar-primary-foreground': '140 40% 10%', '--sidebar-accent': '120 5% 90%', '--sidebar-accent-foreground': '120 5% 26%', '--sidebar-border': '120 5% 88%', '--sidebar-ring': '140 40% 55%'
      },
      dark: {
        '--background': '120 5% 10%', '--foreground': '120 5% 86%', '--card': '120 5% 12%', '--card-foreground': '120 5% 86%', '--popover': '120 5% 12%', '--popover-foreground': '120 5% 86%', '--primary': '140 40% 55%', '--primary-foreground': '140 40% 10%', '--secondary': '120 5% 20%', '--secondary-foreground': '120 5% 86%', '--muted': '120 5% 20%', '--muted-foreground': '120 5% 66%', '--accent': '100 30% 50%', '--accent-foreground': '0 0% 100%', '--destructive': '0 62.8% 30.6%', '--destructive-foreground': '0 0% 98%', '--border': '120 5% 25%', '--input': '120 5% 25%', '--ring': '140 40% 55%', '--chart-1': '140 40% 55%', '--chart-2': '100 30% 50%', '--sidebar-background': '120 5% 12%', '--sidebar-foreground': '120 5% 86%', '--sidebar-primary': '140 40% 55%', '--sidebar-primary-foreground': '140 40% 10%', '--sidebar-accent': '120 5% 20%', '--sidebar-accent-foreground': '120 5% 86%', '--sidebar-border': '120 5% 25%', '--sidebar-ring': '140 40% 55%'
      }
    }
  },
  {
    name: "sand",
    label: "Arena Dorada",
    colors: {
      primary: 'hsl(35, 80%, 60%)',
      accent: 'hsl(25, 70%, 55%)',
      background: 'hsl(40, 30%, 97%)',
    },
    cssVars: {
      light: {
        '--background': '40 30% 97%', '--foreground': '40 10% 25%', '--card': '40 30% 100%', '--card-foreground': '40 10% 25%', '--popover': '40 30% 100%', '--popover-foreground': '40 10% 25%', '--primary': '35 80% 60%', '--primary-foreground': '35 80% 10%', '--secondary': '40 10% 90%', '--secondary-foreground': '40 10% 25%', '--muted': '40 10% 90%', '--muted-foreground': '40 10% 45%', '--accent': '25 70% 55%', '--accent-foreground': '0 0% 100%', '--destructive': '0 84.2% 60.2%', '--destructive-foreground': '0 0% 98%', '--border': '40 10% 88%', '--input': '40 10% 92%', '--ring': '35 80% 60%', '--chart-1': '35 80% 60%', '--chart-2': '25 70% 55%', '--sidebar-background': '40 30% 100%', '--sidebar-foreground': '40 10% 25%', '--sidebar-primary': '35 80% 60%', '--sidebar-primary-foreground': '35 80% 10%', '--sidebar-accent': '40 10% 90%', '--sidebar-accent-foreground': '40 10% 25%', '--sidebar-border': '40 10% 88%', '--sidebar-ring': '35 80% 60%'
      },
      dark: {
        '--background': '40 10% 10%', '--foreground': '40 10% 85%', '--card': '40 10% 12%', '--card-foreground': '40 10% 85%', '--popover': '40 10% 12%', '--popover-foreground': '40 10% 85%', '--primary': '35 80% 60%', '--primary-foreground': '35 80% 10%', '--secondary': '40 10% 20%', '--secondary-foreground': '40 10% 85%', '--muted': '40 10% 20%', '--muted-foreground': '40 10% 65%', '--accent': '25 70% 55%', '--accent-foreground': '0 0% 100%', '--destructive': '0 62.8% 30.6%', '--destructive-foreground': '0 0% 98%', '--border': '40 10% 25%', '--input': '40 10% 25%', '--ring': '35 80% 60%', '--chart-1': '35 80% 60%', '--chart-2': '25 70% 55%', '--sidebar-background': '40 10% 12%', '--sidebar-foreground': '40 10% 85%', '--sidebar-primary': '35 80% 60%', '--sidebar-primary-foreground': '35 80% 10%', '--sidebar-accent': '40 10% 20%', '--sidebar-accent-foreground': '40 10% 85%', '--sidebar-border': '40 10% 25%', '--sidebar-ring': '35 80% 60%'
      }
    }
  },
];
