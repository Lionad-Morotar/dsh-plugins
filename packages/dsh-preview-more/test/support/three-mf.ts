/**
 * Builds a real 3MF archive for the parse test.
 *
 * A hand-written fixture would let a broken reader pass: the point of the test
 * is that an archive some other tool produced parses, so it is written here with
 * a real zip writer and the real 3MF part names.
 */
import { strToU8, zipSync } from "three/examples/jsm/libs/fflate.module.js";

/** The minimal model part the 3MF core specification requires. */
const MODEL_XML = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">',
  "  <resources>",
  '    <object id="1" type="model">',
  "      <mesh>",
  "        <vertices>",
  '          <vertex x="0" y="0" z="0" />',
  '          <vertex x="1" y="0" z="0" />',
  '          <vertex x="0" y="1" z="0" />',
  "        </vertices>",
  "        <triangles>",
  '          <triangle v1="0" v2="1" v3="2" />',
  "        </triangles>",
  "      </mesh>",
  "    </object>",
  "  </resources>",
  "  <build>",
  '    <item objectid="1" />',
  "  </build>",
  "</model>",
  "",
].join("\n");

/** The package-relationship part, which points the root at the model part. */
const RELS_XML = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
  '  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" />',
  "</Relationships>",
  "",
].join("\n");

/** The content-type declarations a 3MF reader looks up before unzipping. */
const CONTENT_TYPES_XML = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
  '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />',
  '  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />',
  "</Types>",
  "",
].join("\n");

/**
 * Build one single-triangle 3MF archive.
 * @returns the archive bytes, in the shape a file read returns.
 */
export function triangleArchive(): Uint8Array {
  return zipSync({
    "[Content_Types].xml": strToU8(CONTENT_TYPES_XML),
    "_rels/.rels": strToU8(RELS_XML),
    "3D/3dmodel.model": strToU8(MODEL_XML),
  });
}
