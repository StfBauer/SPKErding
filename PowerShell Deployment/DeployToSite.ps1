$tenantUrl = "https://n8design.sharepoint.com"
$siteUrl = "/sites/demo2"

Write-Host "Connecting to site" -ForegroundColor Yellow
Connect-SPOnline -Url "$tenantUrl$siteUrl" -Credentials stefan.bauer@n8d.at

# Add theme
Write-Host "Uploading theme files" -ForegroundColor Yellow
$bgimage = "$PSScriptRoot\Resources\custombg.jpg"
$logo = "$PSScriptRoot\Resources\PnP.png"
$colorfile = "$PSScriptRoot\Resources\custom.spcolor"
Add-SPOFile -Path $bgimage -Folder "/_catalogs/theme/15"
Add-SPOFile -Path $logo -Folder "/_catalogs/theme/15"
Add-SPOFile -Path $colorfile -Folder "/_catalogs/theme/15"

Write-Host "Applying theme" -ForegroundColor Yellow
Set-SPOTheme -ColorPaletteUrl "$($siteUrl)/_catalogs/theme/15/custom.spcolor" `
             -BackgroundImageUrl "$($siteUrl)/_catalogs/theme/15/custombg.jpg"

# Set SiteLogo
Set-SPOWeb -SiteLogoUrl "$($siteUrl)/_catalogs/theme/15/PnP.png" -Title "SharePoint Konferenz DE Demo Site"

# Set Masterpage to Oslo
Write-Host "Setting masterpage" -ForegroundColor Yellow
$masterUrl = "$($siteUrl)/_catalogs/masterpage/oslo.master"
Set-SPOMasterPage -MasterPageUrl $masterUrl -CustomMasterPageUrl $masterUrl

# Add contacts list
Write-Host "Adding contacts list" -ForegroundColor Yellow

New-SPOList -Title "Contacts" -Template Contacts -Url "lists/contacts" -OnQuickLaunch

# Add projects list
Write-Host "Adding projects list" -ForegroundColor Yellow

New-SPOList -Title "Projects" -Template GenericList -Url "lists/projects" -OnQuickLaunch

# Create Taxonomy for projects
Write-Host "Importing taxonomy" -ForegroundColor Yellow

Import-SPOTaxonomy -Terms "Demo|Project Types|Internal","Demo|Project Types|External"

Write-Host "Adding taxonomy field to projects list" -ForegroundColor Yellow

$f = Add-SPOTaxonomyField -List "Projects" `
        -DisplayName "Project Type" `
        -InternalName "ProjectType" `
        -TermSetPath "Demo|Project Types" `
        -Group "Demo" `
        -AddToDefaultView 

# Setting value in Property Bag
Write-Host "Setting property bag value" -ForegroundColor Yellow
$datetime = Get-Date

Set-SPOPropertyBagValue -Key "DemoKey" -Value "This site has been branded at $datetime"

# Adding Javascript
Write-Host "Adding Javascript" -ForegroundColor Yellow
$scriptblock = "alert('Hello Erding!');";

Add-SPOJavascriptBlock -Key "DemoScript" -Script $scriptblock

# Add JavaScript file
Add-SPOFile -Path "$PSScriptRoot\Resources\Footer.js" -Folder SiteAssets

# Add JavaScript Links
Add-SPOJavascriptLink -Key "FooterScript" -Url "$($siteUrl)/SiteAssets/Footer.js"
Add-SPOJavascriptLink -Key "JQuery" -Url "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.3.min.js"

# Turn off MDS
Write-Host "Turning off MDS" -ForegroundColor Yellow
Set-SPOMinimalDownloadStrategy -Off
