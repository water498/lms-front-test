Analyze all `mockData.ts` and `store.ts` files under `src/features/` to extract TypeScript interface and type definitions, then update `docs/data-model.md` to reflect the current state of the domain model.

## Steps

1. **Scan mockData sources**
   Use Glob to find all files matching:
   - `src/features/**/mockData.ts`
   - `src/features/**/store.ts`

2. **Extract interfaces & types**
   Read each file and collect:
   - All exported `interface` definitions (field names + types)
   - All exported `type` unions/literals
   - Note which file each entity came from

3. **Compare with existing docs**
   Read `docs/data-model.md`.
   Identify:
   - **New entities** not yet in the doc
   - **Changed fields** (added, removed, renamed, type changed)
   - **Removed entities** (in doc but no longer in mockData)

4. **Update `docs/data-model.md`**
   - Regenerate the Mermaid `erDiagram` block to reflect current entities and relationships
   - Update entity definition tables in the "도메인별 엔티티 정의" section
   - Update the `최종 갱신` date at the top to today's date
   - Keep all design notes intact unless they are directly contradicted by the new data

5. **Output a change summary**
   After writing the file, print a concise summary:
   ```
   ## /erd 실행 결과

   ### 신규 엔티티
   - EntityName (src/features/...)

   ### 변경된 필드
   - Entity.field: oldType → newType

   ### 제거된 엔티티
   - EntityName

   ### 변경 없음
   (없을 경우 "변경 없음")
   ```

## Notes

- Do not modify any source files — only read `src/features/` and write `docs/data-model.md`
- Preserve the overall document structure and Korean language
- If an entity exists in mockData but has no clear relationship to other entities yet, add it to the ERD with a comment `%% 관계 미확정`
- The Mermaid erDiagram syntax does not support array types — represent `string[]` as `string` with a note in the entity table
