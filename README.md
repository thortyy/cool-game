[README.md](https://github.com/user-attachments/files/33058223/README.md)
# Little Lantern

Samostatná HTML plošinovka. Ke hraní otevři `game.html` v prohlížeči.

## Sdílený žebříček přes GitHub

Veřejné GitHub Issues slouží jako úložiště skóre. Hra proto nepotřebuje GitHub token ani další databázovou službu.

1. Vytvoř **veřejný GitHub repozitář** a nahraj do jeho kořene obsah této složky, včetně `.github/workflows/validate-score.yml`.
2. V repozitáři povol Issues a GitHub Actions.
3. Po dokončení všech tří světů zadej do hry repozitář ve formátu `majitel/repozitář` a jméno hráče.
4. Klikni na **Submit score on GitHub**, přihlas se ke GitHubu a vytvoř předvyplněný příspěvek.
5. Action `Validate game scores` skóre zkontroluje a označí labelem `game-score`. Po doběhnutí Action obnov v herním žebříčku výsledky.

Hra načítá deset nejlepších výsledků z posledních 100 veřejných Issue označených jako ověřené. Repozitář lze předvyplnit také parametrem adresy `?scores=majitel/repozitář`. Do hry nikdy nevkládej osobní přístupový token.

Jde o přátelský žebříček, ne o soutěž odolnou proti podvádění: veřejné Issue lze upravit a skóre se nezávisle nepřepočítává z herního záznamu.
