export abstract class DataSource {
  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
  abstract isConnected(): boolean
}

export class MockDataSource extends DataSource {
  private connected = false

  async connect(): Promise<void> {
    this.connected = true
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }
}

export class ApiDataSource extends DataSource {
  private baseUrl: string
  private connected = false

  constructor(baseUrl: string) {
    super()
    this.baseUrl = baseUrl
  }

  async connect(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      if (response.ok) {
        this.connected = true
      }
    } catch {
      this.connected = false
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }

  getBaseUrl(): string {
    return this.baseUrl
  }
}
