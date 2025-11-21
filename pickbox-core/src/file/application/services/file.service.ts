import { Injectable } from '@nestjs/common';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { UpdateFileDto } from 'src/file/dto/update-file.dto';


@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: string) {
    return `This action returns a #${id} file`;
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: string) {
    return `This action removes a #${id} file`;
  }
}
