const de = {
  common: {
    cancel: "Abbrechen",
    delete: "L\u00F6schen",
    save: "Speichern",
    error: "Fehler",
    monthly: "Monatlich",
    yearly: "J\u00E4hrlich",
    success: "Erfolg",
  },
  auth: {
    signIn: "Anmelden",
    signUp: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort best\u00E4tigen",
    forgotPassword: "Passwort vergessen?",
    noAccount: "Kein Konto? ",
    hasAccount: "Bereits ein Konto? ",
    enterEmailAndPassword: "Bitte E-Mail und Passwort eingeben.",
    fillAllFields: "Bitte alle Felder ausf\u00FCllen.",
    meetPasswordRequirements:
      "Bitte alle Passwortanforderungen erf\u00FCllen.",
    passwordsDoNotMatch: "Passw\u00F6rter stimmen nicht \u00FCberein.",
    sendResetLink: "Link senden",
    backToLogin: "Zur\u00FCck zur Anmeldung",
    enterEmailForReset:
      "Gib deine E-Mail ein, um einen Link zum Zur\u00FCcksetzen zu erhalten.",
    enterEmail: "Bitte E-Mail eingeben.",
    resetEmailSent:
      "Wir haben dir eine E-Mail mit einem Link zum Zur\u00FCcksetzen deines Passworts gesendet. Pr\u00FCfe deinen Posteingang.",
    invalidCredentialTitle: "Ung\u00FCltige E-Mail oder Passwort",
    invalidCredentialMessage:
      "\u00DCberpr\u00FCfe deine Anmeldedaten und versuche es erneut.",
    tryAgain: "Erneut versuchen",
    resetPassword: "Zur\u00FCcksetzen",
    emailSentTitle: "E-Mail gesendet",
    emailSentMessage:
      "Pr\u00FCfe deinen Posteingang f\u00FCr den Zur\u00FCcksetzungslink.",
    linkGoogleBanner:
      "Melde dich mit deinem Passwort an, um dein Google-Konto zu verkn\u00FCpfen.",
    googleLinkedSuccess: "Google-Konto erfolgreich verkn\u00FCpft!",
    passwordRuleLength: "Mindestens 8 Zeichen",
    passwordRuleUppercase: "Ein Gro\u00DFbuchstabe",
    passwordRuleNumber: "Eine Zahl",
    passwordRuleSpecial: "Ein Sonderzeichen",
    or: "oder",
    continueWithApple: "Weiter mit Apple",
    continueWithGoogle: "Weiter mit Google",
    existingAccountTitle: "Bestehendes Konto",
    existingAccountGoogle:
      "Ein Konto mit dieser E-Mail existiert bereits. Melde dich mit deinem Passwort an, um Google zu verkn\u00FCpfen.",
    existingAccountOther:
      "Ein Konto mit dieser E-Mail existiert bereits. Melde dich mit deiner bestehenden Methode an, um dieses Konto zu verkn\u00FCpfen.",
  },
  verify: {
    title: "E-Mail best\u00E4tigen",
    message:
      "Wir haben einen Best\u00E4tigungslink an\n{{email}}\ngesendet. Pr\u00FCfe deinen Posteingang oder Spam-Ordner und tippe auf den Link, um fortzufahren.",
    checkButton: "Ich habe meine E-Mail best\u00E4tigt",
    resendButton: "Best\u00E4tigungs-E-Mail erneut senden",
    signOut: "Abmelden",
    emailSentTitle: "E-Mail gesendet",
    emailSentMessage: "Eine neue Best\u00E4tigungs-E-Mail wurde gesendet.",
    notVerifiedTitle: "Noch nicht best\u00E4tigt",
    notVerifiedMessage:
      "Deine E-Mail ist noch nicht best\u00E4tigt. Pr\u00FCfe deinen Posteingang oder Spam-Ordner und tippe auf den Best\u00E4tigungslink.",
    checkErrorMessage:
      "Status konnte nicht \u00FCberpr\u00FCft werden. Versuche es erneut.",
  },
  authErrors: {
    "auth/invalid-email": "Die E-Mail-Adresse ist ung\u00FCltig.",
    "auth/user-disabled": "Dieses Konto wurde deaktiviert.",
    "auth/user-not-found": "Kein Konto mit dieser E-Mail gefunden.",
    "auth/wrong-password": "Falsches Passwort.",
    "auth/invalid-credential":
      "Ung\u00FCltige Anmeldedaten. \u00DCberpr\u00FCfe E-Mail und Passwort.",
    "auth/email-already-in-use":
      "Ein Konto mit dieser E-Mail existiert bereits.",
    "auth/weak-password":
      "Das Passwort ist zu schwach. Verwende mindestens 8 Zeichen mit Gro\u00DFbuchstabe, Zahl und Sonderzeichen.",
    "auth/too-many-requests":
      "Zu viele Versuche. Versuche es sp\u00E4ter erneut.",
    "auth/network-request-failed":
      "Netzwerkfehler. \u00DCberpr\u00FCfe deine Verbindung.",
    "auth/account-exists-with-different-credential":
      "Ein Konto mit dieser E-Mail existiert bereits. Melde dich mit deiner bestehenden Methode an, um dieses Konto zu verkn\u00FCpfen.",
    "auth/requires-recent-login":
      "Aus Sicherheitsgr\u00FCnden melde dich ab und wieder an, bevor du dein Konto l\u00F6schst.",
    default: "Ein Fehler ist aufgetreten. Versuche es erneut.",
  },
  home: {
    title: "Start",
    yearlyBudget: "Jahresbudget",
    monthlyBudget: "Monatsbudget",
    totalCosts: "Gesamtkosten",
    leftover: "\u00DCbrig",
    setYearlyBudget: "Jahresbudget festlegen",
    setMonthlyBudget: "Monatsbudget festlegen",
    pctUsed: "{{pct}}% verwendet",
    enterBudget: "Gib dein gesamtes {{period}} Budget ein",
    noCategories: "Noch keine Kategorien.",
    addCategory: "Kategorie hinzuf\u00FCgen",
  },
  wallets: {
    title: "Konten",
    noWallets: "Noch keine Konten.",
    addWallet: "Konto hinzuf\u00FCgen",
  },
  categoryDetail: {
    yearlyPrefix: "J\u00E4hrlich:",
    monthlyPrefix: "Monatlich:",
    noExpenses: "Keine Ausgaben in dieser Kategorie.",
    addExpense: "Ausgabe hinzuf\u00FCgen",
  },
  walletDetail: {
    yearlyPrefix: "J\u00E4hrlich:",
    monthlyPrefix: "Monatlich:",
    noExpenses:
      "Keine Ausgaben f\u00FCr dieses Konto.\nF\u00FCge Ausgaben aus einer Kategorie hinzu.",
  },
  addEditCategory: {
    editTitle: "Kategorie bearbeiten",
    newTitle: "Neue Kategorie",
    nameLabel: "Name",
    namePlaceholder: "z.B. Familie, Auto, Haus...",
    iconSection: "Symbol",
    saveChanges: "\u00C4nderungen speichern",
    saveCategory: "Kategorie speichern",
    deleteCategory: "Kategorie l\u00F6schen",
    deleteTitle: "Kategorie l\u00F6schen",
    deleteMessage:
      '"{{name}}" l\u00F6schen? Alle Ausgaben in dieser Kategorie werden ebenfalls gel\u00F6scht. Diese Aktion kann nicht r\u00FCckg\u00E4ngig gemacht werden.',
    enterName: "Bitte Kategorienamen eingeben.",
    saveFailed: "Kategorie konnte nicht gespeichert werden.",
  },
  addEditExpense: {
    editTitle: "Ausgabe bearbeiten",
    newTitle: "Neue Ausgabe",
    nameLabel: "Name",
    namePlaceholder: "z.B. Netflix, Versicherung...",
    amountLabel: "Betrag ({{symbol}})",
    amountPlaceholder: "12,99",
    walletSection: "Konto",
    noWallets: "Noch keine Konten. Tippen zum Erstellen.",
    optionsSection: "Optionen",
    essentialLabel: "Wesentliche Ausgabe",
    essentialHint:
      "Wesentliche Ausgaben sind feste Kosten wie Miete, Versicherung oder Abonnements. Sie werden zur Berechnung deines Notfallfonds verwendet.",
    notesSection: "Notizen",
    saveChanges: "\u00C4nderungen speichern",
    saveExpense: "Ausgabe speichern",
    deleteExpense: "Ausgabe l\u00F6schen",
    deleteTitle: "Ausgabe l\u00F6schen",
    deleteMessage: '"{{name}}" l\u00F6schen?',
    enterName: "Bitte Ausgabenamen eingeben.",
    invalidAmount: "Bitte g\u00FCltigen Betrag eingeben.",
    walletRequiredTitle: "Konto erforderlich",
    walletRequiredMessage:
      "Du brauchst mindestens ein Konto, um eine Ausgabe zu speichern. Jetzt erstellen?",
    createWallet: "Konto erstellen",
    saveFailed: "Ausgabe konnte nicht gespeichert werden.",
  },
  addEditWallet: {
    editTitle: "Konto bearbeiten",
    newTitle: "Neues Konto",
    nameLabel: "Name",
    namePlaceholder: "z.B. Revolut, N26...",
    bankIconSection: "Banksymbol",
    other: "Sonstige",
    saveChanges: "\u00C4nderungen speichern",
    saveWallet: "Konto speichern",
    deleteWallet: "Konto l\u00F6schen",
    deleteTitle: "Konto l\u00F6schen",
    deleteMessage: '"{{name}}" l\u00F6schen?',
    enterName: "Bitte Kontonamen eingeben.",
    saveFailed: "Konto konnte nicht gespeichert werden.",
  },
  emergency: {
    title: "Notfallfonds",
    description:
      "Simuliere, wie viel Geld du brauchst, um deine wesentlichen Ausgaben zu decken, wenn dein Einkommen wegf\u00E4llt.",
    noEssential:
      "Noch keine wesentlichen Ausgaben. Markiere eine Ausgabe als wesentlich, um deinen Notfallfonds zu berechnen.",
    expenses: "Ausgaben",
    monthlyCost: "Monatliche Kosten",
    coveragePeriod: "Abdeckungszeitraum",
    yourTarget: "Dein Ziel",
    targetDetail:
      "{{count}} Ausgaben \u00B7 {{monthlyCost}}/Mo \u00D7 {{months}} Mo",
    topExpenses: "Top-Ausgaben",
    recommendation:
      "Die meisten Finanzberater empfehlen, mindestens 3 bis 6 Monate an wesentlichen Ausgaben f\u00FCr unvorhergesehene Ereignisse zu sparen. Passe es an deine Arbeitsplatzsicherheit und deinen pers\u00F6nlichen Komfort an.",
    essentialExpenses: "Wesentliche Ausgaben",
    months_one: "{{count}} Monat",
    months_other: "{{count}} Monate",
    years_one: "{{count}} Jahr",
    years_other: "{{count}} Jahre",
  },
  settings: {
    title: "Einstellungen",
    account: "Konto",
    email: "E-Mail",
    currency: "W\u00E4hrung",
    language: "Sprache",
    legal: "Rechtliches",
    privacyPolicy: "Datenschutzrichtlinie",
    termsOfService: "Nutzungsbedingungen",
    support: "Support",
    signOut: "Abmelden",
    deleteAccount: "Konto l\u00F6schen",
    deleteAccountTitle: "Konto l\u00F6schen",
    deleteAccountMessage:
      "Dadurch werden dein Konto und alle Daten dauerhaft gel\u00F6scht. Diese Aktion kann nicht r\u00FCckg\u00E4ngig gemacht werden.",
    deleteAccountRecentLogin:
      "Aus Sicherheitsgr\u00FCnden melde dich ab und wieder an, bevor du dein Konto l\u00F6schst.",
    deleteAccountFailed:
      "Konto konnte nicht gel\u00F6scht werden. Versuche es erneut.",
    version: "Fixo v{{version}}",
  },
  sort: {
    sortBy: "Sortieren nach",
    newest: "Neueste",
    highest: "H\u00F6chste",
    lowest: "Niedrigste",
  },
  errorBoundary: {
    title: "Etwas ist schiefgelaufen",
    message:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte starte die App neu.",
    restart: "Neustart",
  },
  tabs: {
    home: "Start",
    wallets: "Konten",
    emergency: "Notfall",
    settings: "Einstellungen",
  },
  expenseList: {
    deleteFailed:
      '"{{name}}" konnte nicht gel\u00F6scht werden. Versuche es erneut.',
  },
  categoryCard: {
    expense_one: "{{count}} Ausgabe",
    expense_other: "{{count}} Ausgaben",
  },
  expenseCard: {
    essential: "Wesentlich",
  },
} as const;

export default de;
