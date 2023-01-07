import { Test } from '@nestjs/testing'
import { ApiMailService } from './mail.service'

describe('ApiMailService', () => {
  let service: ApiMailService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiMailService],
    }).compile()

    service = module.get(ApiMailService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })
})
