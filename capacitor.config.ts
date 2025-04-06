
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bca932fc4b7b4179bb013a145643badf',
  appName: 'eye-record-keeper-mobile',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://bca932fc-4b7b-4179-bb01-3a145643badf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    }
  }
};

export default config;
