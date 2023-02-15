import {Router} from "express";
import { controllerHandler } from "../commons";
import {MediaService} from "../services";
import multer from "multer";
import {addNewAudioSchema, getMetaDataSchema, removeAudioSchema} from "../commons";
import {command} from "../services/ffmpegService";
import {isContentTypeValid} from "../middlewares";

export const router = Router();

/**
 * @desc File storage configuration
 */
const storage = multer.diskStorage({
  destination: '../../tmp/'
})
const upload = multer({ storage, });

/**
 * @desc video manipulation service.
 */
const mediaService: MediaService = new MediaService(command);

/**
 * @desc routers [endpoints].
 * endpoints to edit media files.
 */
router
  .use(isContentTypeValid) // middleware for validating multipart/form-data requests.
  .use(upload.single('file')) // middleware to extract files from the request.
  .post('/rm-audio',controllerHandler(mediaService.removeAudio, removeAudioSchema))
  .post('/rm-video', controllerHandler(mediaService.removeVideo))
  .post('/meta-video',controllerHandler(mediaService.getMetadata, getMetaDataSchema))
  .post('/new-audio', controllerHandler(mediaService.addNewAudio, addNewAudioSchema));

/**
 * @desc routers [endpoints].
 * endpoints to get edited media files.
 */
router
  .get('/video/:videoName', controllerHandler(mediaService.getVideo))
