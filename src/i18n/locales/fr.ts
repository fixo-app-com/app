const fr = {
  common: {
    cancel: "Annuler",
    delete: "Supprimer",
    save: "Enregistrer",
    error: "Erreur",
    monthly: "Mensuel",
    yearly: "Annuel",
    success: "Succ\u00E8s",
  },
  auth: {
    signIn: "Se connecter",
    signUp: "S\u2019inscrire",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oubli\u00E9 ?",
    noAccount: "Pas de compte ? ",
    hasAccount: "D\u00E9j\u00E0 un compte ? ",
    enterEmailAndPassword:
      "Veuillez entrer votre e-mail et votre mot de passe.",
    fillAllFields: "Veuillez remplir tous les champs.",
    meetPasswordRequirements:
      "Veuillez respecter toutes les exigences du mot de passe.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
    sendResetLink: "Envoyer le lien",
    backToLogin: "Retour \u00E0 la connexion",
    enterEmailForReset:
      "Entrez votre e-mail pour recevoir un lien de r\u00E9initialisation.",
    enterEmail: "Veuillez entrer votre e-mail.",
    resetEmailSent:
      "Nous vous avons envoy\u00E9 un e-mail avec un lien pour r\u00E9initialiser votre mot de passe. V\u00E9rifiez votre bo\u00EEte de r\u00E9ception.",
    invalidCredentialTitle: "E-mail ou mot de passe invalide",
    invalidCredentialMessage:
      "V\u00E9rifiez vos identifiants et r\u00E9essayez.",
    tryAgain: "R\u00E9essayer",
    resetPassword: "R\u00E9initialiser",
    emailSentTitle: "E-mail envoy\u00E9",
    emailSentMessage:
      "V\u00E9rifiez votre bo\u00EEte de r\u00E9ception pour le lien de r\u00E9initialisation.",
    linkGoogleBanner:
      "Connectez-vous avec votre mot de passe pour lier votre compte Google.",
    googleLinkedSuccess: "Compte Google li\u00E9 avec succ\u00E8s !",
    passwordRuleLength: "Au moins 8 caract\u00E8res",
    passwordRuleUppercase: "Une lettre majuscule",
    passwordRuleNumber: "Un chiffre",
    passwordRuleSpecial: "Un caract\u00E8re sp\u00E9cial",
    or: "ou",
    continueWithApple: "Continuer avec Apple",
    continueWithGoogle: "Continuer avec Google",
    existingAccountTitle: "Compte existant",
    existingAccountGoogle:
      "Un compte avec cet e-mail existe d\u00E9j\u00E0. Connectez-vous avec votre mot de passe pour lier Google.",
    existingAccountOther:
      "Un compte avec cet e-mail existe d\u00E9j\u00E0. Connectez-vous avec votre m\u00E9thode existante pour lier ce compte.",
  },
  verify: {
    title: "V\u00E9rifiez votre e-mail",
    message:
      "Nous avons envoy\u00E9 un lien de v\u00E9rification \u00E0\n{{email}}\nV\u00E9rifiez votre bo\u00EEte de r\u00E9ception ou le dossier spam et appuyez sur le lien pour continuer.",
    checkButton: "J\u2019ai v\u00E9rifi\u00E9 mon e-mail",
    resendButton: "Renvoyer l\u2019e-mail de v\u00E9rification",
    signOut: "Se d\u00E9connecter",
    emailSentTitle: "E-mail envoy\u00E9",
    emailSentMessage:
      "Un nouvel e-mail de v\u00E9rification a \u00E9t\u00E9 envoy\u00E9.",
    notVerifiedTitle: "Pas encore v\u00E9rifi\u00E9",
    notVerifiedMessage:
      "Votre e-mail n\u2019est pas encore v\u00E9rifi\u00E9. V\u00E9rifiez votre bo\u00EEte de r\u00E9ception ou le dossier spam et appuyez sur le lien de v\u00E9rification.",
    checkErrorMessage: "Impossible de v\u00E9rifier le statut. R\u00E9essayez.",
  },
  authErrors: {
    "auth/invalid-email": "L\u2019adresse e-mail n\u2019est pas valide.",
    "auth/user-disabled": "Ce compte a \u00E9t\u00E9 d\u00E9sactiv\u00E9.",
    "auth/user-not-found": "Aucun compte trouv\u00E9 avec cet e-mail.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential":
      "Identifiants invalides. V\u00E9rifiez votre e-mail et mot de passe.",
    "auth/email-already-in-use":
      "Un compte avec cet e-mail existe d\u00E9j\u00E0.",
    "auth/weak-password":
      "Le mot de passe est trop faible. Utilisez au moins 8 caract\u00E8res avec majuscule, chiffre et caract\u00E8re sp\u00E9cial.",
    "auth/too-many-requests": "Trop de tentatives. R\u00E9essayez plus tard.",
    "auth/network-request-failed":
      "Erreur r\u00E9seau. V\u00E9rifiez votre connexion.",
    "auth/account-exists-with-different-credential":
      "Un compte avec cet e-mail existe d\u00E9j\u00E0. Connectez-vous avec votre m\u00E9thode existante pour lier ce compte.",
    "auth/requires-recent-login":
      "Pour des raisons de s\u00E9curit\u00E9, d\u00E9connectez-vous et reconnectez-vous avant de supprimer votre compte.",
    default: "Une erreur s\u2019est produite. R\u00E9essayez.",
  },
  home: {
    title: "Accueil",
    yearlyBudget: "Budget annuel",
    monthlyBudget: "Budget mensuel",
    totalCosts: "Co\u00FBts totaux",
    leftover: "Restant",
    setYearlyBudget: "D\u00E9finir le budget annuel",
    setMonthlyBudget: "D\u00E9finir le budget mensuel",
    pctUsed: "{{pct}}% utilis\u00E9",
    enterBudget: "Entrez votre budget {{period}} total",
    noCategories: "Aucune cat\u00E9gorie pour le moment.",
    addCategory: "Ajouter une cat\u00E9gorie",
    allCategories: "Toutes",
    breakdown: "R\u00E9partition",
  },
  categories: {
    title: "Cat\u00E9gories",
    noCategories: "Aucune cat\u00E9gorie.",
  },
  wallets: {
    title: "Portefeuilles",
    noWallets: "Aucun portefeuille pour le moment.",
    addWallet: "Ajouter un portefeuille",
  },
  categoryDetail: {
    yearlyPrefix: "Annuel :",
    monthlyPrefix: "Mensuel :",
    noExpenses: "Aucune d\u00E9pense dans cette cat\u00E9gorie.",
    addExpense: "Ajouter une d\u00E9pense",
  },
  walletDetail: {
    yearlyPrefix: "Annuel :",
    monthlyPrefix: "Mensuel :",
    noExpenses:
      "Aucune d\u00E9pense pour ce portefeuille.\nAjoutez des d\u00E9penses depuis une cat\u00E9gorie.",
  },
  addEditCategory: {
    editTitle: "Modifier la cat\u00E9gorie",
    newTitle: "Nouvelle cat\u00E9gorie",
    nameLabel: "Nom",
    namePlaceholder: "ex. Famille, Voiture, Maison...",
    iconSection: "Ic\u00F4ne",
    saveChanges: "Enregistrer les modifications",
    saveCategory: "Enregistrer la cat\u00E9gorie",
    deleteCategory: "Supprimer la cat\u00E9gorie",
    deleteTitle: "Supprimer la cat\u00E9gorie",
    deleteMessage:
      'Supprimer "{{name}}" ? Toutes les d\u00E9penses de cette cat\u00E9gorie seront \u00E9galement supprim\u00E9es. Cette action est irr\u00E9versible.',
    enterName: "Veuillez entrer un nom de cat\u00E9gorie.",
    saveFailed: "\u00C9chec de l\u2019enregistrement de la cat\u00E9gorie.",
  },
  addEditExpense: {
    editTitle: "Modifier la d\u00E9pense",
    newTitle: "Nouvelle d\u00E9pense",
    nameLabel: "Nom",
    namePlaceholder: "ex. Netflix, Assurance...",
    amountLabel: "Montant ({{symbol}})",
    amountPlaceholder: "12,99",
    walletSection: "Portefeuille",
    noWallets: "Aucun portefeuille. Appuyez pour en cr\u00E9er un.",
    optionsSection: "Options",
    essentialLabel: "D\u00E9pense essentielle",
    essentialHint:
      "Les d\u00E9penses essentielles sont des co\u00FBts fixes in\u00E9vitables comme le loyer, l\u2019assurance ou les abonnements. Elles sont utilis\u00E9es pour calculer votre fonds d\u2019urgence.",
    notesSection: "Notes",
    saveChanges: "Enregistrer les modifications",
    saveExpense: "Enregistrer la d\u00E9pense",
    deleteExpense: "Supprimer la d\u00E9pense",
    deleteTitle: "Supprimer la d\u00E9pense",
    deleteMessage: 'Supprimer "{{name}}" ?',
    enterName: "Veuillez entrer un nom de d\u00E9pense.",
    invalidAmount: "Veuillez entrer un montant valide.",
    walletRequiredTitle: "Portefeuille requis",
    walletRequiredMessage:
      "Vous avez besoin d\u2019au moins un portefeuille pour enregistrer une d\u00E9pense. En cr\u00E9er un maintenant ?",
    createWallet: "Cr\u00E9er un portefeuille",
    saveFailed: "\u00C9chec de l\u2019enregistrement de la d\u00E9pense.",
  },
  addEditWallet: {
    editTitle: "Modifier le portefeuille",
    newTitle: "Nouveau portefeuille",
    nameLabel: "Nom",
    namePlaceholder: "ex. Revolut, N26...",
    bankIconSection: "Ic\u00F4ne de banque",
    other: "Autre",
    saveChanges: "Enregistrer les modifications",
    saveWallet: "Enregistrer le portefeuille",
    deleteWallet: "Supprimer le portefeuille",
    deleteTitle: "Supprimer le portefeuille",
    deleteMessage: 'Supprimer "{{name}}" ?',
    enterName: "Veuillez entrer un nom de portefeuille.",
    saveFailed: "\u00C9chec de l\u2019enregistrement du portefeuille.",
  },
  emergency: {
    title: "Fonds d\u2019urgence",
    description:
      "Simulez combien d\u2019argent vous avez besoin pour couvrir vos d\u00E9penses essentielles si vos revenus s\u2019arr\u00EAtent.",
    noEssential:
      "Aucune d\u00E9pense essentielle. Marquez une d\u00E9pense comme essentielle pour commencer \u00E0 calculer votre fonds d\u2019urgence.",
    expenses: "D\u00E9penses",
    monthlyCost: "Co\u00FBt mensuel",
    coveragePeriod: "P\u00E9riode de couverture",
    yourTarget: "Votre objectif",
    targetDetail:
      "{{count}} d\u00E9penses \u00B7 {{monthlyCost}}/mois \u00D7 {{months}} mois",
    topExpenses: "D\u00E9penses principales",
    recommendation:
      "La plupart des conseillers financiers recommandent d\u2019\u00E9pargner au moins 3 \u00E0 6 mois de d\u00E9penses essentielles pour les impr\u00E9vus. Ajustez en fonction de la stabilit\u00E9 de votre emploi et de votre confort personnel.",
    essentialExpenses: "D\u00E9penses essentielles",
    months_one: "{{count}} mois",
    months_other: "{{count}} mois",
    years_one: "{{count}} an",
    years_other: "{{count}} ans",
  },
  settings: {
    title: "Param\u00E8tres",
    account: "Compte",
    email: "E-mail",
    currency: "Devise",
    language: "Langue",
    legal: "L\u00E9gal",
    privacyPolicy: "Politique de confidentialit\u00E9",
    termsOfService: "Conditions d\u2019utilisation",
    support: "Support",
    signOut: "Se d\u00E9connecter",
    deleteAccount: "Supprimer le compte",
    deleteAccountTitle: "Supprimer le compte",
    deleteAccountMessage:
      "Cela supprimera d\u00E9finitivement votre compte et toutes vos donn\u00E9es. Cette action est irr\u00E9versible.",
    deleteAccountRecentLogin:
      "Pour des raisons de s\u00E9curit\u00E9, d\u00E9connectez-vous et reconnectez-vous avant de supprimer votre compte.",
    deleteAccountFailed:
      "\u00C9chec de la suppression du compte. R\u00E9essayez.",
    version: "Fixo v{{version}}",
  },
  sort: {
    sortBy: "Trier par",
    newest: "Plus r\u00E9cents",
    highest: "Plus \u00E9lev\u00E9s",
    lowest: "Plus bas",
  },
  errorBoundary: {
    title: "Une erreur s\u2019est produite",
    message:
      "Une erreur inattendue s\u2019est produite. Veuillez red\u00E9marrer l\u2019application.",
    restart: "Red\u00E9marrer",
  },
  tabs: {
    home: "Accueil",
    wallets: "Portefeuilles",
    categories: "Cat\u00E9gories",
    emergency: "Urgence",
    settings: "Param\u00E8tres",
  },
  expenseList: {
    deleteFailed: 'Impossible de supprimer "{{name}}". R\u00E9essayez.',
  },
  categoryCard: {
    expense_one: "{{count}} d\u00E9pense",
    expense_other: "{{count}} d\u00E9penses",
  },
  expenseCard: {
    essential: "Essentiel",
  },
} as const;

export default fr;
