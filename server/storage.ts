import {
  User, InsertUser, users,
  Topic, InsertTopic, topics,
  TopicContent, InsertTopicContent, topicContents,
  RelatedTopic, InsertRelatedTopic, relatedTopics,
  GlossaryTerm, InsertGlossaryTerm, glossaryTerms,
  AiChat, InsertAiChat, aiChats,
  ExpertOpinion, InsertExpertOpinion, expertOpinions
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Topic operations
  getTopic(id: number): Promise<Topic | undefined>;
  getTopics(): Promise<Topic[]>;
  getTopicsByCentury(century: number): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: number, topic: Partial<InsertTopic>): Promise<Topic | undefined>;
  deleteTopic(id: number): Promise<boolean>;

  // Topic content operations
  getTopicContent(topicId: number): Promise<TopicContent | undefined>;
  createTopicContent(content: InsertTopicContent): Promise<TopicContent>;
  updateTopicContent(id: number, content: Partial<InsertTopicContent>): Promise<TopicContent | undefined>;

  // Related topics operations
  getRelatedTopics(topicId: number): Promise<Topic[]>;
  addRelatedTopic(relation: InsertRelatedTopic): Promise<RelatedTopic>;
  removeRelatedTopic(sourceId: number, targetId: number): Promise<boolean>;

  // Glossary operations
  getGlossaryTerm(term: string): Promise<GlossaryTerm | undefined>;
  getGlossaryTerms(): Promise<GlossaryTerm[]>;
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;

  // AI chat operations
  getAiChatsByUser(userId: number): Promise<AiChat[]>;
  getAiChatsByTopic(topicId: number): Promise<AiChat[]>;
  createAiChat(chat: InsertAiChat): Promise<AiChat>;

  // Expert opinions operations
  getExpertOpinionsByTopic(topicId: number): Promise<ExpertOpinion[]>;
  createExpertOpinion(opinion: InsertExpertOpinion): Promise<ExpertOpinion>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private topicContents: Map<number, TopicContent>;
  private relatedTopics: Map<number, RelatedTopic>;
  private glossaryTerms: Map<number, GlossaryTerm>;
  private aiChats: Map<number, AiChat>;
  private expertOpinions: Map<number, ExpertOpinion>;

  private currentUserId: number;
  private currentTopicId: number;
  private currentTopicContentId: number;
  private currentRelatedTopicId: number;
  private currentGlossaryTermId: number;
  private currentAiChatId: number;
  private currentExpertOpinionId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.topicContents = new Map();
    this.relatedTopics = new Map();
    this.glossaryTerms = new Map();
    this.aiChats = new Map();
    this.expertOpinions = new Map();

    this.currentUserId = 1;
    this.currentTopicId = 500; // Increased to avoid conflicts with hardcoded IDs
    this.currentTopicContentId = 1;
    this.currentRelatedTopicId = 1;
    this.currentGlossaryTermId = 1;
    this.currentAiChatId = 1;
    this.currentExpertOpinionId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      role: insertUser.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Topic methods
  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async getTopicsByCentury(century: number): Promise<Topic[]> {
    return Array.from(this.topics.values()).filter(
      (topic) => topic.century === century,
    );
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentTopicId++;
    const topic: Topic = { 
      id,
      title: insertTopic.title,
      century: insertTopic.century,
      shortDescription: insertTopic.shortDescription,
      firstMentionedYear: insertTopic.firstMentionedYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.topics.set(id, topic);
    return topic;
  }

  async updateTopic(id: number, topicUpdate: Partial<InsertTopic>): Promise<Topic | undefined> {
    const topic = this.topics.get(id);
    if (!topic) {
      return undefined;
    }
    const updatedTopic = { 
      ...topic,
      ...topicUpdate,
      updatedAt: new Date() 
    };
    this.topics.set(id, updatedTopic);
    return updatedTopic;
  }

  async deleteTopic(id: number): Promise<boolean> {
    return this.topics.delete(id);
  }

  // Topic content methods
  async getTopicContent(topicId: number): Promise<TopicContent | undefined> {
    return Array.from(this.topicContents.values()).find(
      (content) => content.topicId === topicId,
    );
  }

  async createTopicContent(insertContent: InsertTopicContent): Promise<TopicContent> {
    const id = this.currentTopicContentId++;
    const content: TopicContent = { 
      id,
      topicId: insertContent.topicId,
      fullContent: insertContent.fullContent,
      aiAnalysis: insertContent.aiAnalysis,
      factCheck: insertContent.factCheck,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.topicContents.set(id, content);
    return content;
  }

  async updateTopicContent(id: number, contentUpdate: Partial<InsertTopicContent>): Promise<TopicContent | undefined> {
    const content = this.topicContents.get(id);
    if (!content) {
      return undefined;
    }
    const updatedContent = { 
      ...content,
      ...contentUpdate,
      updatedAt: new Date() 
    };
    this.topicContents.set(id, updatedContent);
    return updatedContent;
  }

  // Related topics methods
  async getRelatedTopics(topicId: number): Promise<Topic[]> {
    const relationIds = Array.from(this.relatedTopics.values())
      .filter((relation) => relation.sourceTopicId === topicId)
      .map((relation) => relation.targetTopicId);
    
    return Array.from(this.topics.values()).filter((topic) => 
      relationIds.includes(topic.id)
    );
  }

  async addRelatedTopic(insertRelation: InsertRelatedTopic): Promise<RelatedTopic> {
    const id = this.currentRelatedTopicId++;
    const relation: RelatedTopic = { 
      id,
      sourceTopicId: insertRelation.sourceTopicId,
      targetTopicId: insertRelation.targetTopicId,
      createdAt: new Date(),
    };
    this.relatedTopics.set(id, relation);
    return relation;
  }

  async removeRelatedTopic(sourceId: number, targetId: number): Promise<boolean> {
    const relationToRemove = Array.from(this.relatedTopics.values()).find(
      (relation) => 
        relation.sourceTopicId === sourceId && 
        relation.targetTopicId === targetId
    );
    
    if (!relationToRemove) {
      return false;
    }
    
    return this.relatedTopics.delete(relationToRemove.id);
  }

  // Glossary methods
  async getGlossaryTerm(term: string): Promise<GlossaryTerm | undefined> {
    return Array.from(this.glossaryTerms.values()).find(
      (glossaryTerm) => glossaryTerm.term.toLowerCase() === term.toLowerCase(),
    );
  }

  async getGlossaryTerms(): Promise<GlossaryTerm[]> {
    return Array.from(this.glossaryTerms.values());
  }

  async createGlossaryTerm(insertTerm: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const id = this.currentGlossaryTermId++;
    const term: GlossaryTerm = { 
      id,
      term: insertTerm.term,
      definition: insertTerm.definition,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.glossaryTerms.set(id, term);
    return term;
  }

  // AI chat methods
  async getAiChatsByUser(userId: number): Promise<AiChat[]> {
    return Array.from(this.aiChats.values()).filter(
      (chat) => chat.userId === userId,
    );
  }

  async getAiChatsByTopic(topicId: number): Promise<AiChat[]> {
    return Array.from(this.aiChats.values()).filter(
      (chat) => chat.topicId === topicId,
    );
  }

  async createAiChat(insertChat: InsertAiChat): Promise<AiChat> {
    const id = this.currentAiChatId++;
    const chat: AiChat = { 
      id,
      userId: insertChat.userId,
      topicId: insertChat.topicId,
      question: insertChat.question,
      response: insertChat.response,
      provider: insertChat.provider,
      createdAt: new Date(),
    };
    this.aiChats.set(id, chat);
    return chat;
  }

  // Expert opinion methods
  async getExpertOpinionsByTopic(topicId: number): Promise<ExpertOpinion[]> {
    return Array.from(this.expertOpinions.values()).filter(
      (opinion) => opinion.topicId === topicId,
    );
  }

  async createExpertOpinion(insertOpinion: InsertExpertOpinion): Promise<ExpertOpinion> {
    const id = this.currentExpertOpinionId++;
    const opinion: ExpertOpinion = { 
      id,
      topicId: insertOpinion.topicId,
      expertName: insertOpinion.expertName,
      expertTitle: insertOpinion.expertTitle,
      opinion: insertOpinion.opinion,
      avatarUrl: insertOpinion.avatarUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.expertOpinions.set(id, opinion);
    return opinion;
  }

  private initializeData() {
    // Sample users
    const admin: InsertUser = { username: "admin", email: "admin@example.com", password: "admin123", role: "admin" };
    const user: InsertUser = { username: "user", email: "user@example.com", password: "user123", role: "user" };
    
    this.createUser(admin);
    this.createUser(user);
    
    // Manuell benutzerdefinierte IDs für Themen setzen, die mit der Frontend-Datendefinition übereinstimmen
    // Geo-Engineering Verschwörungen (ID: 101-104)
    const chemtrails: Topic = {
      id: 101,
      title: "Chemtrails",
      century: 20,
      shortDescription: "Theorie über angebliche chemische Zusätze in Flugzeugabgasen zur Wetterveränderung oder Bevölkerungskontrolle.",
      firstMentionedYear: 1996,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const sonnenspiegel: Topic = {
      id: 102,
      title: "Sonnenspiegel",
      century: 21,
      shortDescription: "Behauptung, dass riesige Spiegel im Weltall installiert werden, um Sonnenlicht zurück ins All zu reflektieren.",
      firstMentionedYear: 2010,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const wetterkontrolle: Topic = {
      id: 103,
      title: "Wetterkontrolle",
      century: 20,
      shortDescription: "Verschwörungstheorie über staatliche Programme zur künstlichen Kontrolle von Wetterphänomenen.",
      firstMentionedYear: 1953,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const aerosol: Topic = {
      id: 104,
      title: "Stratosphärische Aerosolinjektion",
      century: 21,
      shortDescription: "Hypothetisches Verfahren, bei dem Schwefeldioxid in die obere Atmosphäre eingebracht wird, um die globale Erwärmung abzumildern.",
      firstMentionedYear: 2022,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Geheimgesellschaften (ID: 201-204)
    const illuminati: Topic = {
      id: 201,
      title: "Illuminati",
      century: 18,
      shortDescription: "Behauptungen über eine geheime Elite, die im Verborgenen die Weltpolitik steuert.",
      firstMentionedYear: 1776,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const freimaurer: Topic = {
      id: 202,
      title: "Freimaurer",
      century: 18,
      shortDescription: "Verschwörungstheorien über den angeblichen globalen Einfluss der Freimaurerlogen.",
      firstMentionedYear: 1717,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const bilderberg: Topic = {
      id: 203,
      title: "Bilderberg-Gruppe",
      century: 20,
      shortDescription: "Theorie über einen angeblichen geheimen Weltrat aus Wirtschafts- und Politikeliten.",
      firstMentionedYear: 1954,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const schattenregierung: Topic = {
      id: 204,
      title: "Globale Schattenregierung",
      century: 21,
      shortDescription: "Angebliches Netzwerk mächtiger Individuen und Organisationen, die heimlich die Geschicke der Welt lenken.",
      firstMentionedYear: 2000,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Technologie-Verschwörungen (ID: 301-304)
    const fiveG: Topic = {
      id: 301,
      title: "5G und Gesundheit",
      century: 21,
      shortDescription: "Verschwörungstheorie über angebliche gesundheitsschädliche Wirkungen von 5G-Mobilfunktechnologie.",
      firstMentionedYear: 2018,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const rfid: Topic = {
      id: 302,
      title: "RFID-Chips",
      century: 21,
      shortDescription: "Behauptungen über Pläne zur Zwangsimplantierung von Funkchips zur Überwachung der Bevölkerung.",
      firstMentionedYear: 2005,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const ki: Topic = {
      id: 303,
      title: "Künstliche Intelligenz",
      century: 21,
      shortDescription: "Theorien über KI-Systeme, die angeblich heimlich die Kontrolle übernehmen sollen.",
      firstMentionedYear: 2010,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const quantencomputer: Topic = {
      id: 304,
      title: "Quantencomputer-Manipulation",
      century: 21,
      shortDescription: "Theorie, dass Quantencomputer in der Lage sind, die Realität zu manipulieren und alternative Zeitlinien zu erschaffen.",
      firstMentionedYear: 2023,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Politische Verschwörungen (ID: 401-404)
    const deepState: Topic = {
      id: 401,
      title: "Deep State",
      century: 20,
      shortDescription: "Theorie über einen angeblichen 'Staat im Staate', der unabhängig von demokratischen Prozessen agiert.",
      firstMentionedYear: 1960,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const wahlManipulation: Topic = {
      id: 402,
      title: "Wahlmanipulation",
      century: 19,
      shortDescription: "Verschwörungstheorien über systematische Wahlfälschungen in demokratischen Staaten.",
      firstMentionedYear: 1876,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const falseFlag: Topic = {
      id: 403,
      title: "False Flag Operationen",
      century: 19,
      shortDescription: "Behauptungen, dass Regierungen heimlich Terroranschläge inszenieren, um politische Ziele zu erreichen.",
      firstMentionedYear: 1898,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const gedankenkontrolle: Topic = {
      id: 404,
      title: "Gedankenkontrolle durch Medien",
      century: 21,
      shortDescription: "Hypothese, dass Massenmedien systematisch für soziale Programmierung und Meinungsmanipulation eingesetzt werden.",
      firstMentionedYear: 2015,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Topics zur Map hinzufügen
    const allTopics = [
      chemtrails, sonnenspiegel, wetterkontrolle, aerosol,
      illuminati, freimaurer, bilderberg, schattenregierung,
      fiveG, rfid, ki, quantencomputer,
      deepState, wahlManipulation, falseFlag, gedankenkontrolle
    ];
    
    allTopics.forEach(topic => {
      this.topics.set(topic.id, topic);
    });
    
    // Sample glossary terms
    const sampleGlossaryTerms: InsertGlossaryTerm[] = [
      { 
        term: "Chemtrails", 
        definition: "Theorie, dass Kondensstreifen von Flugzeugen in Wirklichkeit gezielt versprühte Chemikalien enthalten" 
      },
      { 
        term: "False Flag", 
        definition: "Behauptung, dass ein Ereignis inszeniert wurde, um einen Vorwand für bestimmte politische Maßnahmen zu schaffen" 
      },
      { 
        term: "Deep State", 
        definition: "Angebliches Netzwerk einflussreicher Personen, die im Verborgenen die wahre Kontrolle über einen Staat ausüben" 
      },
      { 
        term: "Echsenmenschen", 
        definition: "Verschwörungstheorie, die behauptet, dass reptilienartige außerirdische Wesen in Menschengestalt Machtpositionen besetzen" 
      }
    ];
    
    // Create sample glossary terms
    sampleGlossaryTerms.forEach(term => {
      this.createGlossaryTerm(term);
    });
    
    // Topic Inhalte für mehrere Themen erstellen
    const topicContents: InsertTopicContent[] = [
      // Chemtrails (Topic ID: 101)
      {
        topicId: 101,
        fullContent: `
        <h2>Chemtrails: Geschichte und Hintergründe</h2>
        <p>Die Verschwörungstheorie der Chemtrails entstand in den späten 1990er Jahren und verbreitete sich Anfang der 2000er Jahre über das Internet. Im Kern behauptet die Theorie, dass reguläre Kondensstreifen (Contrails) von Flugzeugen in Wirklichkeit absichtlich versprühte Chemikalien (daher "Chemtrails") seien, die verschiedenen Zwecken dienen sollen:</p>
        
        <ul>
          <li>Bewusste Wettermanipulation</li>
          <li>Bevölkerungskontrolle durch gesundheitsschädigende Substanzen</li>
          <li>Militärische Anwendungen</li>
          <li>Bekämpfung des Klimawandels ohne öffentliche Zustimmung</li>
        </ul>
        
        <p>Befürworter der Theorie verweisen auf Beobachtungen wie die Langlebigkeit mancher Kondensstreifen, ungewöhnliche Wolkenformationen und angeblich erhöhte Konzentrationen bestimmter Metalle im Boden. Die wissenschaftliche Gemeinschaft hat diese Behauptungen durchweg zurückgewiesen.</p>
        
        <h3>Psychologische Faktoren</h3>
        <p>Aus psychologischer Sicht erfüllt die Chemtrails-Verschwörungstheorie mehrere typische Funktionen für ihre Anhänger:</p>
        
        <ul>
          <li>Bedürfnis nach Kontrolle und Verständnis komplexer atmosphärischer Phänomene</li>
          <li>Misstrauen gegenüber Regierungen und wissenschaftlichen Institutionen</li>
          <li>Tendenz, Muster in zufälligen Ereignissen zu erkennen (Apophänie)</li>
          <li>Echo-Kammern in sozialen Medien, die bestehende Überzeugungen verstärken</li>
        </ul>`,
        aiAnalysis: "Die Chemtrails-Theorie weist alle typischen Merkmale einer modernen Verschwörungstheorie auf: Sie postuliert eine geheime, mächtige Gruppe mit böswilligen Absichten, erfordert ein umfassendes Schweigen tausender Beteiligter und widerspricht etablierter wissenschaftlicher Evidenz. Die Theorie wurde wiederholt durch Atmosphärenwissenschaftler widerlegt.",
        factCheck: "Die behaupteten Effekte von \"Chemtrails\" auf Gesundheit und Umwelt sind wissenschaftlich nicht nachgewiesen. Kondensstreifen bestehen aus gefrorenen Wasserkristallen, die sich unter bestimmten atmosphärischen Bedingungen bilden. Die chemische Zusammensetzung von Kondensstreifen wurde umfassend analysiert und entspricht den erwarteten Emissionen von Flugzeugtriebwerken."
      },
      
      // Wetterkontrolle (Topic ID: 103)
      {
        topicId: 103,
        fullContent: `
        <h2>Wetterkontrolle: Zwischen Wissenschaft und Verschwörungstheorie</h2>
        <p>Die Verschwörungstheorie der Wetterkontrolle behauptet, dass Regierungen oder mächtige Organisationen Technologien entwickelt haben, um das Wetter zu manipulieren und als Waffe einzusetzen. Diese Theorie hat verschiedene Ausprägungen:</p>
        
        <ul>
          <li>Erzeugung von Dürren in feindlichen Gebieten</li>
          <li>Auslösen von Überschwemmungen und Stürmen als Waffe</li>
          <li>Gezielte Manipulation des globalen Klimas</li>
          <li>Künstliche Erzeugung von Erdbeben durch die HAARP-Anlage in Alaska</li>
        </ul>
        
        <p>Der Ursprung dieser Theorien liegt teilweise in realen Forschungsprojekten wie dem "Project Cirrus" der 1940er und 1950er Jahre, bei dem Wolkenimpfung zur Wetterbeeinflussung erprobt wurde. Auch das HAARP-Programm (High-frequency Active Auroral Research Program) in Alaska wird oft als geheimes Wetterwaffen-Programm dargestellt, obwohl es eigentlich der Erforschung der Ionosphäre dient.</p>
        
        <h3>Historischer Kontext</h3>
        <p>Die Idee der Wetterkontrolle hat eine lange Geschichte. Während des Vietnamkriegs setzte die US-Armee tatsächlich die Operation "Popeye" ein, bei der Wolken mit Silberiodid geimpft wurden, um die Regenzeit zu verlängern und die Nachschubwege des Vietcong zu erschweren. Dieses Programm blieb bis 1974 geheim und führte nach seiner Enthüllung zu internationalen Verträgen gegen Umweltkriegsführung.</p>`,
        aiAnalysis: "Die Wetterkontroll-Verschwörungstheorie kombiniert reale, begrenzte wissenschaftliche Fähigkeiten zur lokalen Wetterbeeinflussung mit stark übertriebenen Behauptungen über globale Wetter- und Klimakontrolle. Während einige historische Beispiele wie Operation Popeye belegen, dass begrenzte Wettermanipulation möglich ist, gibt es keine Beweise für die behaupteten umfassenden Fähigkeiten zur Wetterkontrolle als Waffe.",
        factCheck: "Die tatsächlichen wissenschaftlichen Fähigkeiten zur Wetterbeeinflussung sind stark begrenzt und beschränken sich hauptsächlich auf lokale Wolkenimpfung, um Niederschlag zu fördern oder Hagel zu reduzieren. Die behauptete Fähigkeit, ganze Wettermuster zu kontrollieren oder Naturkatastrophen auszulösen, wird von der wissenschaftlichen Gemeinschaft als unmöglich betrachtet. Das HAARP-Programm ist ein offenes Forschungsprojekt zur Ionosphären-Untersuchung und hat nicht die Fähigkeit, Erdbeben oder andere Naturkatastrophen auszulösen."
      },
      
      // Illuminati (Topic ID: 201)
      {
        topicId: 201,
        fullContent: `
        <h2>Die Illuminati: Von der historischen Organisation zur Verschwörungstheorie</h2>
        <p>Die Illuminati (deutsch: "die Erleuchteten") wurden 1776 von Adam Weishaupt in Bayern als aufklärerische Geheimgesellschaft gegründet. Ihr Ziel war es, durch Bildung und moralische Vervollkommnung den Absolutismus zu überwinden und die Aufklärung zu fördern. Bereits 1785 wurde der Orden von Kurfürst Karl Theodor verboten und löste sich auf.</p>
        
        <p>Als moderne Verschwörungstheorie wird behauptet, die Illuminati hätten nie aufgehört zu existieren und würden als geheime Machtelite die Weltpolitik, Wirtschaft und Kultur kontrollieren. Diesen Theorien zufolge verfolgen die Illuminati einen ausgeklügelten Plan zur Errichtung einer "Neuen Weltordnung" (New World Order).</p>
        
        <h3>Elemente der modernen Illuminati-Verschwörung</h3>
        <ul>
          <li>Kontrolle der internationalen Banken und des globalen Finanzsystems</li>
          <li>Manipulation der Medien und Unterhaltungsindustrie</li>
          <li>Infiltration von Regierungen und internationalen Organisationen</li>
          <li>Vermeintliche symbolische Hinweise in Logos und populärer Kultur</li>
        </ul>`,
        aiAnalysis: "Die moderne Illuminati-Verschwörungstheorie ist ein klassisches Beispiel für die Umwandlung einer historischen, kurzlebigen Organisation in einen zeitlosen, allgegenwärtigen Sündenbock. Sie erfüllt das psychologische Bedürfnis nach einfachen Erklärungen für komplexe globale Zusammenhänge und bietet ein zusammenhängendes Narrativ für scheinbar unverbundene Ereignisse. Besonders das Internet hat zur Verbreitung und Verschmelzung mit anderen Verschwörungstheorien beigetragen.",
        factCheck: "Historisch gesehen existierten die Illuminati nur etwa neun Jahre (1776-1785) und hatten in dieser Zeit maximal 2.000 Mitglieder. Es gibt keine Belege für ein Fortbestehen über das Verbot hinaus. Die behauptete weltweite Macht und der Einfluss der Illuminati sind historisch nicht nachweisbar. Viele angebliche 'Beweise' in Form von Symbolen und Zeichen (wie das 'Allsehende Auge' auf der US-Dollarnote) haben tatsächlich andere historische Ursprünge."
      },
      
      // 5G und Gesundheit (Topic ID: 301)
      {
        topicId: 301,
        fullContent: `
        <h2>5G und Gesundheit: Entstehung und Verbreitung einer modernen Verschwörungstheorie</h2>
        <p>Die Verschwörungstheorien rund um die fünfte Generation des Mobilfunkstandards (5G) begannen mit dem weltweiten Ausbau dieser Technologie ab etwa 2018. Die Hauptbehauptungen umfassen:</p>
        
        <ul>
          <li>5G verursache direkte Gesundheitsschäden wie Krebs, Unfruchtbarkeit und neurologische Störungen</li>
          <li>Die Technologie schwäche das Immunsystem und habe die COVID-19-Pandemie verursacht oder verschlimmert</li>
          <li>5G-Strahlung verändere die DNA oder enthalte Nanotechnologie zur Bevölkerungskontrolle</li>
          <li>5G-Türme dienten der flächendeckenden Überwachung</li>
        </ul>
        
        <p>Die Theorie fand besonders während der COVID-19-Pandemie Verbreitung, als einige Anhänger einen Zusammenhang zwischen dem 5G-Ausbau und der Ausbreitung des Virus postulierten. Dies führte in mehreren Ländern zu Vandalismus und Brandanschlägen auf Mobilfunkmasten.</p>
        
        <h3>Wissenschaftlicher Kontext</h3>
        <p>5G nutzt elektromagnetische Wellen im Bereich von 30 bis 300 GHz, die als nicht-ionisierende Strahlung gelten. Im Gegensatz zu ionisierender Strahlung (wie Röntgenstrahlen) hat nicht-ionisierende Strahlung nicht genug Energie, um Elektronen aus Atomen zu lösen oder direkte DNA-Schäden zu verursachen. Die Hauptwirkung von Hochfrequenzstrahlung im Körper ist die Erwärmung von Gewebe, was bei den zulässigen Grenzwerten für Mobilfunk minimal ist.</p>`,
        aiAnalysis: "Die 5G-Verschwörungstheorie ist ein typisches Beispiel für Technologieskepsis, die oft bei neuen, für Laien schwer verständlichen Technologien auftritt. Sie kombiniert reale Besorgnis über potenzielle unbekannte gesundheitliche Auswirkungen mit stark übertriebenen oder wissenschaftlich unhaltbaren Behauptungen. Die zeitliche Überschneidung des 5G-Ausbaus mit der COVID-19-Pandemie schuf einen idealen 'Sturm' für die Verbreitung dieser Theorien, da Menschen nach einfachen Erklärungen für die komplexe Pandemiesituation suchten.",
        factCheck: "Umfangreiche wissenschaftliche Studien haben keine Beweise für gesundheitsschädliche Wirkungen von 5G-Strahlung bei Einhaltung der internationalen Grenzwerte gefunden. Die Weltgesundheitsorganisation und andere Gesundheitsbehörden weltweit haben erklärt, dass 5G-Technologie sicher ist. Die behaupteten Zusammenhänge zwischen 5G und COVID-19 widersprechen grundlegenden biologischen Prinzipien, da Viren nicht durch elektromagnetische Wellen übertragen werden können und viele Länder mit schweren COVID-19-Ausbrüchen zu Beginn der Pandemie noch gar kein 5G-Netz hatten."
      }
    ];
    
    // Create topic contents
    topicContents.forEach(content => {
      const newContent: TopicContent = {
        id: this.currentTopicContentId++,
        topicId: content.topicId,
        fullContent: content.fullContent,
        aiAnalysis: content.aiAnalysis,
        factCheck: content.factCheck,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.topicContents.set(newContent.id, newContent);
    });
    
    // Sample expert opinions
    const expertOpinions: InsertExpertOpinion[] = [
      // For Chemtrails (101)
      {
        topicId: 101,
        expertName: "Dr. Thomas Weber",
        expertTitle: "Professor für Atmosphärenwissenschaften, Universität München",
        opinion: "Die physikalischen und chemischen Eigenschaften von Kondensstreifen sind gut verstanden und dokumentiert. Sie bestehen hauptsächlich aus Eiskristallen, die sich bilden, wenn Wasserdampf aus den Flugzeugabgasen in der kalten Luft in großer Höhe kondensiert. Die behaupteten 'Chemtrails' würden eine globale Verschwörung erfordern, die praktisch unmöglich geheim zu halten wäre.",
        avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
      },
      {
        topicId: 101,
        expertName: "Dr. Julia Schneider",
        expertTitle: "Wissenschaftssoziologin, Humboldt-Universität Berlin",
        opinion: "Verschwörungstheorien wie Chemtrails florieren besonders in Zeiten gesellschaftlicher Unsicherheit und technologischen Wandels. Sie bieten einfache Erklärungen für komplexe Phänomene und ein Gefühl von Kontrolle in einer zunehmend unübersichtlichen Welt. Die digitale Vernetzung hat die Verbreitung solcher Theorien erheblich beschleunigt.",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      },
      
      // For Wetterkontrolle (103)
      {
        topicId: 103,
        expertName: "Prof. Dr. Markus Reichstein",
        expertTitle: "Direktor am Max-Planck-Institut für Biogeochemie",
        opinion: "Die wissenschaftlichen und technologischen Grenzen machen es unmöglich, dass irgendeine Organisation oder Regierung vollständige Kontrolle über komplexe Wettersysteme ausüben kann. Lokale Wetterbeeinflussung wie Wolkenimpfung ist in begrenztem Umfang möglich, aber die Idee einer globalen Wetterkontrolle überschätzt unsere Fähigkeiten bei weitem.",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
      },
      
      // For Illuminati (201)
      {
        topicId: 201,
        expertName: "Dr. Michael Butter",
        expertTitle: "Professor für Amerikanische Literatur und Kulturgeschichte, Universität Tübingen",
        opinion: "Die Illuminati-Verschwörungstheorie ist ein typisches Beispiel für die 'Große Verschwörung', bei der eine kleine, geheime Elite angeblich die Welt kontrolliert. Solche Narrative erfüllen wichtige psychologische Funktionen: Sie reduzieren Komplexität, geben ein Gefühl von Handlungsfähigkeit und schaffen Gemeinschaft unter den Gläubigen. Die historischen Illuminati und die in den Verschwörungstheorien beschriebene Gruppe haben praktisch nichts gemeinsam außer dem Namen.",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      },
      
      // For 5G und Gesundheit (301)
      {
        topicId: 301,
        expertName: "Prof. Dr. Sarah Wagner",
        expertTitle: "Leiterin der Abteilung für Strahlenbiologie, Bundesamt für Strahlenschutz",
        opinion: "Die biologischen Wirkungen von elektromagnetischen Feldern im Frequenzbereich von 5G wurden in tausenden wissenschaftlichen Studien untersucht. Bei Einhaltung der international anerkannten Grenzwerte gibt es keine wissenschaftlich belegten gesundheitsschädlichen Auswirkungen. Die Hauptwirkung, nämlich die Erwärmung von Gewebe, ist bei den verwendeten Intensitäten minimal und liegt weit unter natürlich vorkommenden Temperaturveränderungen im Körper.",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      }
    ];

    // Create expert opinions
    expertOpinions.forEach(opinion => {
      this.createExpertOpinion(opinion);
    });

    // Related topics
    const relatedTopicsList: InsertRelatedTopic[] = [
      // Chemtrails related to others
      { sourceTopicId: 101, targetTopicId: 103 }, // Chemtrails related to Wetterkontrolle
      { sourceTopicId: 101, targetTopicId: 301 }, // Chemtrails related to 5G
      
      // Illuminati related to others
      { sourceTopicId: 201, targetTopicId: 202 }, // Illuminati related to Freimaurer
      { sourceTopicId: 201, targetTopicId: 204 }, // Illuminati related to Globale Schattenregierung
      
      // 5G related to others
      { sourceTopicId: 301, targetTopicId: 303 }, // 5G related to KI
      { sourceTopicId: 301, targetTopicId: 302 }, // 5G related to RFID
    ];

    // Create related topics
    relatedTopicsList.forEach(relation => {
      this.addRelatedTopic(relation);
    });
  }
}

export const storage = new MemStorage();