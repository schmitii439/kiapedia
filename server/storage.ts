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
    this.currentTopicId = 1;
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
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
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
    const now = new Date();
    const topic: Topic = { 
      ...insertTopic, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.topics.set(id, topic);
    return topic;
  }

  async updateTopic(id: number, topicUpdate: Partial<InsertTopic>): Promise<Topic | undefined> {
    const topic = this.topics.get(id);
    if (!topic) return undefined;

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
    const now = new Date();
    const content: TopicContent = { 
      ...insertContent, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.topicContents.set(id, content);
    return content;
  }

  async updateTopicContent(id: number, contentUpdate: Partial<InsertTopicContent>): Promise<TopicContent | undefined> {
    const content = this.topicContents.get(id);
    if (!content) return undefined;

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
    const relations = Array.from(this.relatedTopics.values()).filter(
      (relation) => relation.sourceTopicId === topicId,
    );
    
    return Promise.all(
      relations.map(async (relation) => {
        const topic = await this.getTopic(relation.targetTopicId);
        if (!topic) throw new Error(`Related topic with id ${relation.targetTopicId} not found`);
        return topic;
      })
    );
  }

  async addRelatedTopic(insertRelation: InsertRelatedTopic): Promise<RelatedTopic> {
    const id = this.currentRelatedTopicId++;
    const relation: RelatedTopic = { 
      ...insertRelation, 
      id 
    };
    this.relatedTopics.set(id, relation);
    return relation;
  }

  async removeRelatedTopic(sourceId: number, targetId: number): Promise<boolean> {
    const relatedTopic = Array.from(this.relatedTopics.values()).find(
      (relation) => relation.sourceTopicId === sourceId && relation.targetTopicId === targetId,
    );
    
    if (relatedTopic) {
      return this.relatedTopics.delete(relatedTopic.id);
    }
    return false;
  }

  // Glossary term methods
  async getGlossaryTerm(term: string): Promise<GlossaryTerm | undefined> {
    return Array.from(this.glossaryTerms.values()).find(
      (glossary) => glossary.term.toLowerCase() === term.toLowerCase(),
    );
  }

  async getGlossaryTerms(): Promise<GlossaryTerm[]> {
    return Array.from(this.glossaryTerms.values());
  }

  async createGlossaryTerm(insertTerm: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const id = this.currentGlossaryTermId++;
    const term: GlossaryTerm = { 
      ...insertTerm, 
      id 
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
    const now = new Date();
    const chat: AiChat = { 
      ...insertChat, 
      id,
      createdAt: now
    };
    this.aiChats.set(id, chat);
    return chat;
  }

  // Expert opinions methods
  async getExpertOpinionsByTopic(topicId: number): Promise<ExpertOpinion[]> {
    return Array.from(this.expertOpinions.values()).filter(
      (opinion) => opinion.topicId === topicId,
    );
  }

  async createExpertOpinion(insertOpinion: InsertExpertOpinion): Promise<ExpertOpinion> {
    const id = this.currentExpertOpinionId++;
    const opinion: ExpertOpinion = { 
      ...insertOpinion, 
      id 
    };
    this.expertOpinions.set(id, opinion);
    return opinion;
  }

  // Initialize with sample data
  private initializeData() {
    // Sample topics for each century
    const sampleTopics: InsertTopic[] = [
      // 18th Century
      { 
        title: "Illuminati", 
        century: 18, 
        shortDescription: "Eine geheime Gesellschaft, die angeblich die Weltordnung kontrolliert",
        firstMentionedYear: 1776
      },
      { 
        title: "Freimaurer", 
        century: 18, 
        shortDescription: "Vermeintliche geheime Einflussnahme auf politische Entwicklungen",
        firstMentionedYear: 1717
      },
      
      // 19th Century
      { 
        title: "Protokolle der Weisen von Zion", 
        century: 19, 
        shortDescription: "Gefälschtes antisemitisches Dokument über angebliche jüdische Pläne zur Weltherrschaft",
        firstMentionedYear: 1897
      },
      { 
        title: "Rothschild-Familie", 
        century: 19, 
        shortDescription: "Vorwürfe einer angeblichen Kontrolle des Bankensystems und der Weltpolitik",
        firstMentionedYear: 1815
      },
      
      // 20th Century
      { 
        title: "Mondlandung", 
        century: 20, 
        shortDescription: "Behauptung, die Apollo-Mondlandungen seien in einem Filmstudio inszeniert worden",
        firstMentionedYear: 1969
      },
      { 
        title: "Area 51", 
        century: 20, 
        shortDescription: "Geheime Basis mit angeblichen außerirdischen Technologien",
        firstMentionedYear: 1950
      },
      { 
        title: "JFK-Attentat", 
        century: 20, 
        shortDescription: "Alternative Theorien zur Ermordung von Präsident Kennedy",
        firstMentionedYear: 1963
      },
      
      // 21st Century
      { 
        title: "5G und Gesundheitsrisiken", 
        century: 21, 
        shortDescription: "Unbelegte Behauptungen über Gesundheitsschäden durch 5G-Mobilfunktechnologie",
        firstMentionedYear: 2019
      },
      { 
        title: "QAnon", 
        century: 21, 
        shortDescription: "Weitreichende Verschwörungstheorie mit politischen Elementen",
        firstMentionedYear: 2017
      },
      { 
        title: "Geo-Engineering", 
        century: 21, 
        shortDescription: "Behauptungen über geheime Wettermanipulation durch Kondensstreifen",
        firstMentionedYear: 2010
      },
    ];

    // Create sample topics
    sampleTopics.forEach(topic => {
      this.createTopic(topic);
    });

    // Sample glossary terms
    const sampleGlossaryTerms: InsertGlossaryTerm[] = [
      {
        term: "Chemtrails",
        definition: "Theorie, dass Kondensstreifen von Flugzeugen eigentlich chemische Substanzen zur Wettermanipulation oder Bevölkerungskontrolle enthalten.",
        relatedTopicId: 10 // Geo-Engineering
      },
      {
        term: "Contrails",
        definition: "Kondensstreifen, die durch die Kondensation von Wasserdampf aus Flugzeugtriebwerken in großen Höhen entstehen.",
        relatedTopicId: 10 // Geo-Engineering
      },
      {
        term: "Apophänie",
        definition: "Die Tendenz, bedeutungsvolle Verbindungen zwischen nicht zusammenhängenden Phänomenen zu sehen.",
        relatedTopicId: null
      }
    ];

    // Create sample glossary terms
    sampleGlossaryTerms.forEach(term => {
      this.createGlossaryTerm(term);
    });

    // Sample topic content for Geo-Engineering
    const geoEngineeringContent: InsertTopicContent = {
      topicId: 10,
      content: `<p><strong>Geo-Engineering</strong>, auch als Chemtrails bekannt, bezieht sich auf eine Verschwörungstheorie, die behauptet, dass Regierungen, Unternehmen oder andere Akteure absichtlich Chemikalien in die Atmosphäre freisetzen, um das Wetter zu manipulieren, die Bevölkerung zu kontrollieren oder andere geheime Ziele zu verfolgen.</p>
      <h2>Ursprung und Entwicklung</h2>
      <p>Die Theorie entstand in den späten 1990er Jahren, gewann aber in den 2010er Jahren durch soziale Medien erheblich an Popularität. Der Begriff "Chemtrails" ist ein Kofferwort aus "Chemical Trails" (chemische Spuren) im Gegensatz zu den wissenschaftlich anerkannten Contrails (Kondensstreifen).</p>
      <h2>Wissenschaftliche Bewertung</h2>
      <p>Die wissenschaftliche Gemeinschaft hat die Chemtrail-Theorie wiederholt widerlegt. Kondensstreifen bestehen hauptsächlich aus Wasserdampf, der unter bestimmten atmosphärischen Bedingungen kondensiert und gefriert. Eine umfassende Studie aus dem Jahr 2016, veröffentlicht im Fachjournal Environmental Research Letters, befragte 77 Atmosphärenwissenschaftler, von denen 76 keine Beweise für Chemtrails fanden.</p>
      <h2>Psychologische und soziologische Aspekte</h2>
      <p>Die Popularität der Geo-Engineering-Verschwörungstheorie lässt sich teilweise durch mehrere psychologische Faktoren erklären:</p>
      <ul>
        <li>Bedürfnis nach Kontrolle und Verständnis komplexer atmosphärischer Phänomene</li>
        <li>Misstrauen gegenüber Regierungen und wissenschaftlichen Institutionen</li>
        <li>Tendenz, Muster in zufälligen Ereignissen zu erkennen (Apophänie)</li>
        <li>Echo-Kammern in sozialen Medien, die bestehende Überzeugungen verstärken</li>
      </ul>`,
      aiAnalysis: "Die Geo-Engineering-Theorie weist alle typischen Merkmale einer modernen Verschwörungstheorie auf: Sie postuliert eine geheime, mächtige Gruppe mit böswilligen Absichten, erfordert ein umfassendes Schweigen tausender Beteiligter und widerspricht etablierter wissenschaftlicher Evidenz. Die Theorie wurde wiederholt durch Atmosphärenwissenschaftler widerlegt.",
      factCheck: "Die behaupteten Effekte von \"Chemtrails\" auf Gesundheit und Umwelt sind wissenschaftlich nicht nachgewiesen. Kondensstreifen bestehen aus gefrorenen Wasserkristallen, die sich unter bestimmten atmosphärischen Bedingungen bilden. Die chemische Zusammensetzung von Kondensstreifen wurde umfassend analysiert und entspricht den erwarteten Emissionen von Flugzeugtriebwerken."
    };

    // Create sample topic content
    this.createTopicContent(geoEngineeringContent);

    // Sample expert opinions for Geo-Engineering
    const geoEngineeringExpertOpinions: InsertExpertOpinion[] = [
      {
        topicId: 10,
        expertName: "Dr. Thomas Weber",
        expertTitle: "Professor für Atmosphärenwissenschaften, Universität München",
        opinion: "Die physikalischen und chemischen Eigenschaften von Kondensstreifen sind gut verstanden und dokumentiert. Sie bestehen hauptsächlich aus Eiskristallen, die sich bilden, wenn Wasserdampf aus den Flugzeugabgasen in der kalten Luft in großer Höhe kondensiert. Die behaupteten 'Chemtrails' würden eine globale Verschwörung erfordern, die praktisch unmöglich geheim zu halten wäre.",
        avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5"
      },
      {
        topicId: 10,
        expertName: "Dr. Julia Schneider",
        expertTitle: "Wissenschaftssoziologin, Humboldt-Universität Berlin",
        opinion: "Verschwörungstheorien wie Geo-Engineering florieren besonders in Zeiten gesellschaftlicher Unsicherheit und technologischen Wandels. Sie bieten einfache Erklärungen für komplexe Phänomene und ein Gefühl von Kontrolle in einer zunehmend unübersichtlichen Welt. Die digitale Vernetzung hat die Verbreitung solcher Theorien erheblich beschleunigt.",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      }
    ];

    // Create sample expert opinions
    geoEngineeringExpertOpinions.forEach(opinion => {
      this.createExpertOpinion(opinion);
    });

    // Set up related topics for Geo-Engineering
    const geoEngineeringRelatedTopics: InsertRelatedTopic[] = [
      { sourceTopicId: 10, targetTopicId: 8 }, // Geo-Engineering related to 5G
      { sourceTopicId: 10, targetTopicId: 9 }, // Geo-Engineering related to QAnon
    ];

    // Create related topics
    geoEngineeringRelatedTopics.forEach(relation => {
      this.addRelatedTopic(relation);
    });
  }
}

export const storage = new MemStorage();
